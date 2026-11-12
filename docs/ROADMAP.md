# Closet Manager — Roadmap

> Document vivant du projet. Dernière mise à jour : 2026-11-12.
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
| 6C — MUI : gestion des placards | ⏭ Prochain | Liste des placards réels, création, édition, suppression confirmée et tests E2E PostgreSQL | `feat/mui-closet-crud` (proposition) |
| 6D — Upload : photo de profil | Prévu | Étude de Multer + S3, stockage de la clé objet, récupération sécurisée et remplacement de photo ; décider si Redis est utile | Branche à définir |
| 6E — MUI : harmonisation UI | Prévu | Navigation, états chargement/erreur/vide, responsive et cohérence visuelle | Branche à définir |
| 7 — CRUD Clothing Item backend | Reporté | Remplacer le prototype en mémoire par le modèle SQL réel avec ownership hérité du placard | Branche à définir |
| 8 — Clothing Item frontend | Prévu | Lister, ajouter, modifier, supprimer les vêtements d'un placard | Branche à définir |
| 9 — Tags, catégories, recherche | Prévu | Gestion et filtrage des vêtements/tenues | À préciser |
| 10 — Outfits | Prévu | Créer des tenues à partir des vêtements, les afficher et les retrouver | À préciser |
| 11 — Images des vêtements | Prévu | Réutiliser l'upload du profil pour clothing_picture : plusieurs images, couverture et suppression | À préciser |
| 12 — Finition et déploiement | Exploratoire | Tests renforcés, UX, sécurité et déploiement VPS | À préciser |

Les sous-lots 6A à 6E sont des étapes pédagogiques distinctes : les travaux UI encadrent un lot autonome consacré au stockage des images. Le lot 7 est délibérément reporté pour privilégier le frontend.

## Prochaine action concrète

**Lot 6C — Gestion des placards réels avec Material UI**, depuis `dev`, branche proposée `feat/mui-closet-crud`.

Le lot 6B est fusionné par la PR #16. Le frontend conserve un ancien `ClosetManager.tsx` dont le modèle `{ isOpen, clothes }` est un prototype en mémoire : **ne pas confondre ce prototype et l'entité SQL `closet`**.

Découper le travail en petites étapes validables :
1. **6C.1 — Contrats et lecture :** types frontend `Closet` alignés sur la réponse API, `closet.service.ts` Axios, composant de liste avec GET `/api/v1/closets`, état de chargement/vide/erreur.
2. **6C.2 — Création :** formulaire MUI (nom obligatoire, description facultative), POST `/api/v1/closets`, rafraîchissement de liste et gestion de `409`.
3. **6C.3 — Édition :** formulaire MUI prérempli, PATCH `/api/v1/closets/:id`, erreurs `400/404/409`.
4. **6C.4 — Suppression :** confirmation MUI explicite ; DELETE avec avertissement sur la cascade SQL des vêtements.
5. **6C.5 — Vérifications :** `npm run lint` et `npm run build` frontend, parcours navigateur → API → PostgreSQL, rechargement persistant et contrôle d'accès entre deux utilisateurs. Review Codex puis PR vers `dev`.

**Périmètre strict :** les placards de la base PostgreSQL, pas encore les vêtements, photos ou outfits. Conserver les services Auth et le thème. Éviter les abstractions de formulaires et routeurs non nécessaires. Mettre de côté ou isoler clairement l'ancien prototype `ClosetManager` pour ne pas entretenir deux représentations concurrentes du placard.

**Lot 6D ensuite — Upload photo de profil :** étudier directement un stockage objet S3 avec Multer/`multer-s3`, plutôt qu'une étape de stockage local destinée à être abandonnée. Conserver la clé de l'objet en base et produire une URL d'accès selon la politique de confidentialité retenue. Les URL présignées expirent : ne pas les conserver comme référence durable en base. Redis n'est **pas un prérequis** ; mesurer ou justifier le besoin de cache avant de l'introduire. Ne jamais présumer qu'un upload vers S3 est sécurisé sans validation du fichier, contrôle d'accès, limites de taille, secrets hors dépôt et nettoyage des fichiers remplacés.

## Vérifications et dette technique

- **Lot 5 :** `npm run build` backend réussi le 2026-11-10 (vérification locale rapportée). Review Codex sans remarque bloquante et PR #14 fusionnée. **CRUD Closet E2E non encore validé** ; à vérifier au lot 6C.
- **Backend lint :** `npm run check` échoue actuellement sur quatre `await` inutiles dans `backend/src/repositories/clothes.repository.ts` (prototype en mémoire). Corriger ces expressions lors d'un petit correctif indépendant ; ne pas ignorer durablement l'échec de la commande globale.
- **CRUD /clothes :** en mémoire et fondé sur un ancien modèle (`type`, `style`, `isFavorite`) non aligné avec `clothing_item` SQL. À remplacer lors du lot 7, sans l'utiliser comme vraie persistance.
- **Authorization admin :** les routes `/users` et `/users/:id` sont authentifiées mais pas encore restreintes à un rôle admin ; sécuriser avant exposition publique.
- **Conflits PostgreSQL :** traiter de manière homogène les violations `23505` pour email/pseudo, y compris en accès concurrent.
- **Session / sécurité :** revoir les options de cookie, CORS, CSRF et la politique de renouvellement des tokens avant déploiement. Ne pas interpréter le fonctionnement local comme une garantie de sécurité en production.
- **Suppression en cascade :** supprimer un placard supprime ses vêtements associés selon le schéma SQL ; ajouter une confirmation UI explicite.
- **Frontend :** les formulaires MUI du compte et les Alert sont fusionnés via PR #16 ; une navigation par routes pourra être envisagée plus tard à la place des booléens de vues dans `App.tsx`.
- **Vite :** exclure `.vite/` du suivi Git (cache local de préoptimisation des dépendances).
- **Tests :** pas encore de suite automatisée significative pour ce backend ; prévoir progressivement tests de services/API et vérifications de non-régression.

## Points à préciser plus tard

- Direction artistique définitive : couleurs, typographie, choix clair/sombre, identité du projet, et degré de personnalisation par l'élève.
- Règles fonctionnelles des placards : nombre maximal, placard par défaut, comportement si le dernier placard est supprimé.
- Catalogues de catégories et sous-catégories ; tags personnalisés et filtrage.
- Données d'une tenue : sélection de plusieurs vêtements, recherche, multi-placards.
- Upload photo de profil prévu après le CRUD Closet frontend : choix du bucket, clés d'objet, URL publiques ou présignées, remplacement et suppression, coût et stratégie de cache éventuelle.
- Réutilisation ultérieure de cette logique pour les photos de vêtements et les couvertures.
- Stratégie de tests et éventuel déploiement public.

## Convention de mise à jour

Après chaque PR fusionnée dans `dev` :
1. Mettre à jour l'état du lot et ajouter la référence de PR.
2. Distinguer ce qui est **fusionné**, **testé réellement**, **en cours** ou **reporté**.
3. Actualiser la prochaine action concrète et ses critères de validation.
4. Reporter explicitement la dette technique et les décisions qui influencent les cours suivants.

Cette roadmap est un plan de travail vivant. Le code, les résultats de tests et les PR sont les preuves de l'implémentation effective. Ne pas marquer un lot « testé E2E » si seuls le build ou la review ont été réalisés.
