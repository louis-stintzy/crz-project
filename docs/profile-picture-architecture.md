# Closet Manager — Architecture de la photo de profil (lot 6D)

> Décisions préparées le 25 novembre 2026, sur `feat/profile-picture-upload`.
>
> **Statut :** document de conception ; aucune route d'upload, migration SQL, ressource AWS ou intégration frontend n'est encore réalisée.
>
> **Périmètre :** photo de profil uniquement. Les images des vêtements (`clothing_picture`) seront abordées dans un lot ultérieur.

## 1. Objectif et décisions

Permettre à un utilisateur authentifié de charger, consulter, remplacer et supprimer une photo de profil. L'avatar devra être visible **pendant toute la navigation connectée**, pas seulement dans `ProfilePage` ; il pourra ouvrir ultérieurement un menu de compte (profil, déconnexion, etc.).

Décisions validées :
- Stockage **Amazon S3**, bucket **privé** avec Block Public Access.
- Images transmises de React à **Express**, puis à S3 ; le navigateur ne reçoit aucun identifiant AWS.
- Fichiers stockés avec une **clé d'objet** générée par le serveur ; PostgreSQL conserve cette clé, **jamais** une URL présignée.
- Consultation via **URL GET présignée à durée limitée** (durée cible initiale : 15 min).
- Pas de Redis, pas de `multer-s3` ni d'upload direct navigateur → S3 dans ce premier lot.
- Backend organisé selon l'architecture actuelle routes → contrôleurs → services → repositories ; service S3 isolé et simple.

Références existantes sur `dev` : `backend/db/init.sql` (`app_user.picture_url`), `backend/src/schemas/appUser.schema.ts`, `backend/src/types/appUser.types.ts`, `backend/src/mappers/appUser.mapper.ts`, `backend/src/repositories/appUser.repository.ts`, `frontend/src/types/appUser.types.ts` et `frontend/src/components/user/ProfilePage.tsx`.

## 2. Parcours de données

### Écriture

```text
ProfilePage (File, formulaire multipart/form-data)
    → POST /api/v1/users/me/picture (cookie JWT)
    → checkAuth() → Multer (1 image, 5 Mo max)
    → contrôle de contenu + décodage/réencodage de l'image
    → service S3 : PutObject (bucket privé, clé aléatoire)
    → repository utilisateur : enregistrer picture_key dans PostgreSQL
    → réponse de succès
```

Le `userId` vient de `req.user` (JWT vérifié), jamais du corps envoyé par le navigateur. Ne pas exposer publiquement une route d'upload d'image par identifiant arbitraire.

### Lecture et avatar global

```text
AuthProvider connaît currentUser
    → état partagé de photo lié à la session (provider léger ou hook partagé)
    → GET /api/v1/users/me/picture-url
    → backend : lire picture_key → GetObject présigné sur S3
    → { url, expiresAt }  (ou { url: null, expiresAt: null })
    → avatar MUI dans AppLayout/en-tête + ProfilePage
```

Ne pas effectuer une requête distincte pour chaque composant affichant l'avatar. La logique de consultation/rafraîchissement doit être **partagée par session** ; l'avatar de `ProfilePage` et celui de l'en-tête lisent la même URL courante.

L'URL est une donnée temporaire en mémoire, pas une nouvelle source de vérité SQL. L'avatar affiche les initiales si aucune photo n'existe, en attente de chargement ou si la récupération échoue.

## 3. Contrats API proposés (à valider avec les tests du lot 6D.2–6D.4)

Toutes les routes ci-dessous sont sous `/api/v1/users` et protégées par `checkAuth()`.

| Verbe | Route | Requête | Réponse cible |
| --- | --- | --- | --- |
| POST | `/me/picture` | `multipart/form-data`, champ fichier `picture` | `200` avec confirmation, ou contrat utilisateur mis à jour à préciser |
| GET | `/me/picture-url` | Aucune | `200` avec `{ "url": string \| null, "expiresAt": string \| null }` |
| DELETE | `/me/picture` | Aucune | `204 No Content` |

Une photo nouvelle remplace celle de l'utilisateur connecté ; pas de galerie d'images de profil. Pour un nom de champ incorrect, un fichier manquant, un contenu invalide ou un dépassement de taille, retourner une erreur 4xx claire. `401` pour une session absente/invalide ; pas de fuite d'existence de clés S3 d'autres utilisateurs. Les URL signées ne sont jamais enregistrées en base ni journalisées.

**Questions de contrat restantes :** après POST, renvoyer `200` avec une représentation utilisateur ou un message simple ; choisir un format d'erreur cohérent avec `AppError`. Ne pas figer une réponse artificielle avant le code backend.

## 4. Modèle et migration SQL

**État actuel :**
- `app_user.picture_url VARCHAR(255)` en base ;
- `pictureUrl` dans les types/mapper du backend et du frontend ;
- `PATCH /users/me` accepte une URL libre ;
- `ProfilePage` affiche un champ texte URL.

**Modèle cible :**
- `app_user.picture_key TEXT NULL` : clé durable de l'objet dans le bucket, par ex. `users/<userId>/profile/<uuid>.webp`.
- Le backend et son repository utilisent `pictureKey` pour l'accès au stockage ; le client n'a pas à recevoir cette clé dans `AppUserPublic`.
- Retirer le champ `pictureUrl` de `PATCH /users/me` et du formulaire de modification générale ; la photo passe uniquement par les nouvelles routes dédiées.
- `GET /users/me` conserve le profil public (identité, pseudo, email), sans y insérer une URL S3 périssable ; prévoir les ajustements nécessaires de `AuthProvider` et des types.

**Migration :** prévoir une migration SQL explicite pour les bases existantes (ajout de `picture_key`, puis traitement des anciennes valeurs URL, puis retrait de `picture_url`). Les anciennes URL ne sont pas convertibles automatiquement en clés S3 ; le traitement peut consister à les abandonner après vérification. Mettre à jour `init.sql` pour les nouvelles installations, sans exécuter son script destructif sur une base contenant des données à conserver.

## 5. Validation et transformations des fichiers

Choix de départ pour **une** photo de profil :
- Taille de réception : **5 Mo max**, Multer `memoryStorage()` avec `limits.fileSize` et `limits.files = 1`.
- Formats autorisés à l'entrée : JPEG, PNG, WebP.
- Ne pas se fier uniquement au nom de fichier, à l'extension ou au `mimetype` déclaré par le client.
- Décoder réellement le fichier et le **normaliser/réencoder** (outil envisagé : `sharp`), en limitant aussi les dimensions / pixels pour éviter les fichiers compressés mais démesurés.
- Sortie envisagée : WebP normalisé (ex. limite 512 × 512 px, sans agrandissement), métadonnées non nécessaires retirées ; clé terminée par `.webp`, `ContentType: image/webp`.
- UUID aléatoire côté serveur ; ne jamais reprendre tel quel le nom de fichier fourni par le client.

La validation en frontend est un confort d'interface ; la validation backend est obligatoire. Éviter de déployer Multer sur toutes les routes ou d'accepter des uploads anonymes.

## 6. Stockage, sécurité et coûts AWS

- Région envisagée : `eu-west-3` (Paris), selon la région choisie lors de la création réelle.
- Bucket dédié au projet, Block Public Access activé, pas de politique `public-read`, pas d'ACL publique.
- Chiffrement S3 au repos, HTTPS pour les échanges.
- Identité AWS dédiée à l'application, avec principe du **moindre privilège** (`s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` sur le préfixe retenu, aucune permission d'administration globale).
- En développement, privilégier un profil AWS CLI / identité temporaire si disponible plutôt que des clés longue durée. En production, utiliser des identifiants sécurisés propres au serveur ou un rôle IAM quand l'hébergement le permet.
- Variables envisagées : `AWS_REGION`, `S3_BUCKET_NAME` ; les éventuels identifiants AWS restent **hors Git et hors variables Vite**.
- Activer MFA et suivi de facturation / budget d'alerte. Ne pas créer nécessairement un nouveau compte racine : choisir un compte de développement existant ou isoler le projet dans un compte distinct selon l'organisation et les coûts souhaités.
- Ne pas envoyer de clés, secret access keys, identifiants de connexion, cookies ou URL présignées dans des conversations ou commits.

## 7. URL présignées : expiration, renouvellement et cache

Durée initiale cible : **15 minutes** (à ajuster après tests). `expiresAt` représente la date calculée côté backend ; la validité réelle peut être raccourcie par l'expiration des identifiants AWS utilisés pour signer ou par des politiques AWS.

L'avatar doit être visible globalement, même après plusieurs minutes d'utilisation :
1. Au démarrage d'une session authentifiée, charger une seule fois l'URL de la photo et son `expiresAt`.
2. Partager cette URL entre l'en-tête et `ProfilePage` dans un état de présentation associé à la session (un petit hook/provider partagé si nécessaire ; ne pas dupliquer des GET).
3. Actualiser l'URL **avant** son expiration (marge de sécurité, par exemple 1 minute) ou lorsque la page redevient visible / l'utilisateur revient sur l'onglet et que la date est proche ou dépassée. Ne pas multiplier les timers par avatar.
4. Après upload/remplacement/suppression, invalider immédiatement l'URL précédente puis recharger la nouvelle représentation.
5. À la déconnexion ou lors d'un `401`, effacer l'URL de l'ancienne session et éviter qu'une réponse asynchrone tardive ne réinjecte l'ancien avatar.
6. En cas d'erreur, afficher les initiales et proposer une nouvelle tentative ; ne pas faire de boucle de rafraîchissement agressive.

**Important :** le navigateur peut afficher une image déjà téléchargée depuis son cache, même lorsque son URL de consultation a expiré. Il faut néanmoins gérer l'expiration pour un nouvel accès réseau, un rechargement ou un onglet restant ouvert longtemps.

Aucun Redis n'est nécessaire : signer une URL à la demande est simple ; le frontend peut conserver temporairement l'URL en mémoire.

## 8. Remplacement, suppression et cohérence SQL/S3

**Remplacement :** lire l'ancienne clé → valider la nouvelle image → `PutObject` avec **nouvelle clé** → mise à jour SQL → suppression de l'ancien objet après réussite. Si la mise à jour SQL échoue, tenter de supprimer le nouvel objet et journaliser toute erreur de nettoyage. Un échec de suppression de l'ancien objet ne doit pas effacer la référence SQL désormais valide.

**Suppression :** prévoir comment rendre la photo invisible dans l'application et libérer l'objet S3 malgré une erreur partielle. Les systèmes SQL et S3 ne partagent pas de transaction atomique ; définir l'ordre et une stratégie de nettoyage/reprise. La suppression du compte (`DELETE /users/me`) doit également traiter le fichier de profil ; les cascades SQL ne suppriment jamais un objet S3.

**Concurrence :** les uploads simultanés peuvent produire des objets orphelins ; pour ce lot, au minimum contrôler l'état/les références et documenter les limites. Avant un déploiement public, renforcer le nettoyage et les transitions de session.

## 9. Réutilisation future et hors périmètre

Le service de stockage peut fournir quelques fonctions simples (upload, génération de lien, suppression) réutilisables pour `clothing_picture` plus tard. Il ne faut pas ajouter maintenant de modèles ou d'endpoints pour les images de vêtements.

Hors périmètre 6D : Redis, upload multipart direct vers S3 avec URL PUT présignée, CDN/CloudFront, galerie de profils, traitement asynchrone, tâches planifiées, système générique de gestion des images, menu de compte complet.

## 10. Lots et critères de validation

- **6D.1 :** architecture consignée, branche créée, choix AWS privés/IAM/budget préparés. Aucun code métier d'upload.
- **6D.2 :** une image valide envoyée via API aboutit dans S3 avec clé enregistrée ; fichiers invalides et utilisateurs anonymes sont refusés ; erreurs AWS/SQL ne laissent pas silencieusement un état incohérent.
- **6D.3 :** URL GET présignée valide et expirante, remplacement/suppression, gestion des anciennes images et suppression de compte ; tests de cohérence S3/SQL.
- **6D.4 :** formulaire React/MUI, aperçu, avatar global avec initiales en fallback, URL renouvelable et avatar qui suit upload/logout/reconnexion sans fuite entre comptes.
- **6D.5 :** vérifications API, accès non autorisés, retour au premier plan après expiration, nettoyage, lint/build, review Codex et documentation API.

## 11. Références documentaires officielles

- [AWS SDK JavaScript v3 — S3 examples](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html)
- [AWS S3 — Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [AWS S3 — Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
- [AWS IAM — Security best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Multer documentation](https://github.com/expressjs/multer)
