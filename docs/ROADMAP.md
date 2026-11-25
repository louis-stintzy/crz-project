# Closet Manager — Roadmap

> Document vivant du projet. Dernière mise à jour : 2026-11-25.
>
> **Source de vérité :** les lots déclarés « terminés » correspondent aux fonctionnalités présentes dans les PR fusionnées dans `dev`. Une fusion ne prouve pas, à elle seule, la validation complète en conditions réelles. Les vérifications et limites connues sont signalées séparément.
>
> **Branche d'intégration :** `dev`. **Branche de référence stable :** `main` (ne pas supposer qu'elle contient les derniers lots).

## Vision

Créer une application web personnelle de gestion de garde-robe : chaque utilisateur dispose de placards virtuels contenant des vêtements, peut constituer des tenues (`outfits`), puis rechercher et retrouver vêtements et tenues à l'aide de catégories, tags et filtres.

Le projet progresse par fonctionnalités utilisables, avec une préférence pour des lots petits, vérifiables et adaptés aux séances de cours.

## Objectif pédagogique

Projet réalisé avec une élève ayant débuté sans connaissance préalable de TypeScript ou de la gestion de projet. L'enseignant prépare une fonctionnalité avant le cours, puis la reconstruit ou l'explique avec elle.

Objectifs progressifs :
- TypeScript, fonctions, objets, types, modules et asynchronisme ;
- React : composants, props, état, formulaires, contexte et appels HTTP ;
- Express, API REST, codes HTTP et validation avec Zod ;
- PostgreSQL, modèle conceptuel de données, relations et requêtes SQL ;
- authentification JWT, cookies et autorisation par propriétaire des données ;
- Git, branches, PR, revues, petites itérations et documentation ;
- conception d'interface avec Material UI, accessibilité et ergonomie.

**Contrainte pédagogique :** privilégier une architecture lisible et cohérente plutôt qu'une sophistication prématurée. Les décisions UI sont prises avec l'élève ; Material UI (MUI) est son choix.

## Architecture actuelle

- **Frontend :** React, TypeScript, Vite, Axios, `AuthProvider` et contexte de notifications. Material UI, Emotion, Roboto, thème global et AppLayout installés ; Login/Register/Profile et confirmation de suppression migrés vers MUI ; notifications typées via Alert.
- **Backend :** Node.js, Express 5, TypeScript, Zod, PostgreSQL (`pg`), architecture routes → controllers → services → repositories, mappers SQL/API et gestion centralisée des erreurs via `AppError`.
- **Authentification :** register/login/logout, bcrypt, JWT en cookie HTTP-only, `checkAuth()`, routes `/users/me`. La restauration de session frontend repose sur `GET /users/me`.
- **Données :** `app_user`, `closet`, `clothing_item`, `clothing_category`, `tag`, `outfit`, photos et tables d'association. MCD : [MCD](./MCD.svg) et [source Mocodo](./mocodo.md). Initialisation et jeu de données : `backend/db/init.sql` et `backend/db/seed.sql`.
- **Environnement :** Docker Compose local pour la base ; instructions dans [database-local-setup.md](./database-local-setup.md).
- **Documentation API :** [docs/api/routes](./api/routes).

### Décisions de conception

- Les placards appartiennent à un utilisateur (`closet.user_id`) ; `userId` est déduit du JWT et non accepté depuis le corps de la requête.
- Les requêtes SQL ciblant un placard par ID filtrent aussi sur `user_id`. Un placard absent ou appartenant à un autre utilisateur donne `404`.
- Le nom d'un placard est unique **par utilisateur**, conformément à `UNIQUE (user_id, name)` ; doublon → `409`.
- Les types exposés au frontend utilisent camelCase ; les lignes PostgreSQL utilisent snake_case, converti par un mapper.
- L'ancien CRUD `/clothes` conserve temporairement un repository **en mémoire** : il n'est pas le CRUD PostgreSQL définitif de `clothing_item`.
- Le choix MUI porte d'abord sur la présentation. Éviter de réécrire les services d'authentification ou les contrats API pour un simple changement de composants visuels.

## Lots et avancement

| Lot | État | Livrable / objectif | Référence |
| --- | --- | --- | --- |
| 0 — Prototype frontend | ✅ Fusionné | Formulaire de vêtement et premiers composants React | PR [#1](https://github.com/louis-stintzy/crz-project/pull/1), [#2](https://github.com/louis-stintzy/crz-project/pull/2) |
| 1 — Initialisation backend et données | ✅ Fusionné | Express/TypeScript et base PostgreSQL, MCD, seed | PR [#3](https://github.com/louis-stintzy/crz-project/pull/3), [#4](https://github.com/louis-stintzy/crz-project/pull/4) |
| 2 — CRUD utilisateur backend | ✅ Fusionné | Repository, service, controller et API `app_user` | PR [#6](https://github.com/louis-stintzy/crz-project/pull/6) |
| 3 — Authentification JWT backend | ✅ Fusionné | Inscription, connexion, déconnexion, cookie JWT, `checkAuth` | PR [#8](https://github.com/louis-stintzy/crz-project/pull/8) |
| 4 — Authentification frontend et profil | ✅ Fusionné | AuthProvider, Login/Register, `/users/me`, édition/suppression profil | PR [#10](https://github.com/louis-stintzy/crz-project/pull/10), [#13](https://github.com/louis-stintzy/crz-project/pull/13) |
| 5 — CRUD Closet backend | ✅ Fusionné | Routes, Zod, SQL PostgreSQL, contrôles de propriété, mapper, documentation | PR [#14](https://github.com/louis-stintzy/crz-project/pull/14) |
| 6A — MUI : fondations | ✅ Fusionné | MUI/Emotion, police Roboto, ThemeProvider, CssBaseline et AppLayout | PR [#15](https://github.com/louis-stintzy/crz-project/pull/15) |
| 6B — MUI : compte utilisateur | ✅ Fusionné | Login/Register/Profile, confirmation de suppression et Alert typées ; flux API préservés | PR [#16](https://github.com/louis-stintzy/crz-project/pull/16) |
| 6C — MUI : gestion des placards | ✅ Fusionné | Liste, création, édition, suppression confirmée ; vérifications navigateur rapportées, sans preuve exhaustive des scénarios E2E/cascade SQL | PR [#17](https://github.com/louis-stintzy/crz-project/pull/17) |
| 6D — Upload : photo de profil | 🔧 En préparation (6D.1) | S3 privé, clé persistée en SQL, URL présignée renouvelable, upload sécurisé et avatar disponible dans l'application | `feat/profile-picture-upload` — [architecture](./profile-picture-architecture.md) |
| 6E — MUI : harmonisation UI | Prévu | Navigation, états chargement/erreur/vide, responsive et cohérence visuelle | Branche à définir |
| 7 — CRUD Clothing Item backend | Reporté | Remplacer le prototype en mémoire par le modèle SQL réel avec ownership hérité du placard | Branche à définir |
| 8 — Clothing Item frontend | Prévu | Lister, ajouter, modifier, supprimer les vêtements d'un placard | Branche à définir |
| 9 — Tags, catégories, recherche | Prévu | Gestion et filtrage des vêtements/tenues | À préciser |
| 10 — Outfits | Prévu | Créer des tenues à partir des vêtements, les afficher et les retrouver | À préciser |
| 11 — Images des vêtements | Prévu | Réutiliser l'upload du profil pour clothing_picture : plusieurs images, couverture et suppression | À préciser |
| 12 — Finition et déploiement | Exploratoire | Tests renforcés, UX, sécurité et déploiement VPS | À préciser |

Les sous-lots 6A à 6E sont des étapes pédagogiques distinctes : les travaux UI encadrent un lot autonome consacré au stockage des images. Le lot 7 est délibérément reporté pour privilégier le frontend.

## Prochaine action concrète

**Lot 6D — Photo de profil avec stockage Amazon S3**, sur la branche `feat/profile-picture-upload` dérivée de `dev`.

La PR [#17](https://github.com/louis-stintzy/crz-project/pull/17) a été fusionnée dans `dev` le 25 novembre 2026 (commit de fusion `a66a327`). Le lot 6C contient désormais GET/POST/PATCH/DELETE côté React/MUI et l'intercepteur Axios stabilisé. Les tests complets de suppression en cascade et de contrôle d'accès sur deux comptes ne sont pas réputés acquis sans rapport de test explicite.

**Décisions 6D.1 validées par l'utilisateur :** Amazon S3, objets privés, consultation via URL présignées, périmètre limité à la photo de profil. Redis n'est pas retenu. Le code devra permettre un avatar **visible en permanence** dans l'interface connectée (en-tête/AppLayout), ouvrant à terme un menu de compte ; il ne sera donc pas limité à `ProfilePage`. Document de référence : [profile-picture-architecture.md](./profile-picture-architecture.md).

Découpage et critères de validation :
1. **6D.1 — Architecture et stockage (en cours) :** documenter le contrat API et SQL, la politique de confidentialité, les règles d'expiration/renouvellement, les risques d'orphelins S3, les accès AWS et les tests. Préparer un bucket privé avec budget/alertes et identité IAM de moindre privilège. Pas d'upload codé à ce stade.
2. **6D.2 — Backend : upload initial :** `multipart/form-data` avec `checkAuth()`, Multer avec limites, validation de contenu et normalisation d'image, `PutObject` via AWS SDK v3, nouvelle clé d'objet, persistance en base et tests API.
3. **6D.3 — Backend : lecture et cycle de vie :** endpoint pour URL `GetObject` présignée et date d'expiration, remplacement/suppression avec nettoyage des objets S3, gestion des échecs partiels et suppression de compte. Une migration SQL est nécessaire pour les installations existantes.
4. **6D.4 — Frontend : photo et avatar global :** sélection/aperçu/upload dans `ProfilePage`, consultation de l'URL depuis un composant partagé (en-tête), actualisation anticipée ou à la reprise de l'application avant expiration, invalidation au logout et après remplacement/suppression, fallback sur les initiales et menu de compte minimal ou ultérieur.
5. **6D.5 — Validation :** scénarios 401/403/404, format/taille invalides, remplacement et suppression, URL expirée, multi-comptes, rafraîchissement de page, maintien de l'avatar visible, vérification S3/SQL, lint/build, documentation et review avant PR.

**Périmètre strict :** ne pas développer encore `clothing_picture`, les tenues, un cache Redis ou une infrastructure de tâches. Le formulaire actuel accepte une URL `pictureUrl` ; il faudra retirer cette entrée libre du PATCH utilisateur, décider du traitement des anciennes valeurs et exposer une URL de lecture éphémère séparée de la clé persistée.

## Vérifications et dette technique

- **Lot 5 / 6C :** build backend du 2026-11-10 et PR #14 ; PR #17 fusionnée. Ne pas confondre tests manuels rapportés et couverture E2E automatisée ou validation explicite de la cascade SQL et des accès multi-utilisateurs.
- **Backend lint :** `npm run check` échoue actuellement sur quatre `await` inutiles dans `backend/src/repositories/clothes.repository.ts` (prototype en mémoire). Corriger ces expressions lors d'un petit correctif indépendant ; ne pas ignorer durablement l'échec de la commande globale.
- **CRUD /clothes :** en mémoire et fondé sur un ancien modèle (`type`, `style`, `isFavorite`) non aligné avec `clothing_item` SQL. À remplacer lors du lot 7, sans l'utiliser comme vraie persistance.
- **Authorization admin :** les routes `/users` et `/users/:id` sont authentifiées mais pas encore restreintes à un rôle admin ; sécuriser avant exposition publique.
- **Conflits PostgreSQL :** traiter de manière homogène les violations `23505` pour email/pseudo, y compris en accès concurrent.
- **Session / sécurité :** revoir les options de cookie, CORS, CSRF et la politique de renouvellement des tokens avant déploiement. Ne pas interpréter le fonctionnement local comme une garantie de sécurité en production.
- **Suppression en cascade :** confirmation UI implémentée ; la cascade SQL supprime des lignes en base mais jamais les objets S3. Prévoir le nettoyage lors des futurs uploads de vêtements et lors de la suppression de compte.
- **Frontend :** les formulaires MUI du compte et les Alert sont fusionnés via PR #16 ; une navigation par routes pourra être envisagée plus tard à la place des booléens de vues dans `App.tsx`.
- **Vite :** exclure `.vite/` du suivi Git (cache local de préoptimisation des dépendances).
- **Tests :** pas encore de suite automatisée significative pour ce backend ; prévoir progressivement tests de services/API et vérifications de non-régression.

## Points à préciser plus tard

- Direction artistique définitive : couleurs, typographie, choix clair/sombre, identité du projet, et degré de personnalisation par l'élève.
- Règles fonctionnelles des placards : nombre maximal, placard par défaut, comportement si le dernier placard est supprimé.
- Catalogues de catégories et sous-catégories ; tags personnalisés et filtrage.
- Données d'une tenue : sélection de plusieurs vêtements, recherche, multi-placards.
- Upload photo de profil : décisions S3 privé + URL présignées + clé persistée validées ; préciser les droits IAM, le bucket, la migration des anciennes URL et le mécanisme de renouvellement de l'avatar global.
- Réutilisation ultérieure de cette logique pour les photos de vêtements et les couvertures.
- Stratégie de tests et éventuel déploiement public.

## Convention de mise à jour

Après chaque PR fusionnée dans `dev` :
1. Mettre à jour l'état du lot et ajouter la référence de PR.
2. Distinguer ce qui est **fusionné**, **testé réellement**, **en cours** ou **reporté**.
3. Actualiser la prochaine action concrète et ses critères de validation.
4. Reporter explicitement la dette technique et les décisions qui influencent les cours suivants.

Cette roadmap est un plan de travail vivant. Le code, les résultats de tests et les PR sont les preuves de l'implémentation effective. Ne pas marquer un lot « testé E2E » si seuls le build ou la review ont été réalisés.
