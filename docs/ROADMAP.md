# Closet Manager — Roadmap

> Document vivant du projet. Dernière mise à jour : 2026-11-11.
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

- **Frontend :** React, TypeScript, Vite, Axios, `AuthProvider` et contexte de notifications. Material UI, Emotion, Roboto, thème global et AppLayout installés ; formulaires Auth/Profile encore en HTML natif.
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
| 6B — MUI : compte utilisateur | ⏭ Prochain | LoginPage, RegisterPage, ProfilePage et confirmation de suppression en MUI ; préserver les flux API | `feat/mui-user-forms` (proposition) |
| 6C — MUI : gestion des placards | Prévu | Liste des placards, création, édition, suppression avec confirmation ; connexion au CRUD PostgreSQL | Branche à définir |
| 6D — MUI : harmonisation UI | Prévu | Navigation, notifications globales, états chargement/erreur/vide, responsive et cohérence visuelle | Branche à définir |
| 7 — CRUD Clothing Item backend | Reporté | Remplacer le prototype en mémoire par le modèle SQL réel avec ownership hérité du placard | Branche à définir |
| 8 — Clothing Item frontend | Prévu | Lister, ajouter, modifier, supprimer les vêtements d'un placard | Branche à définir |
| 9 — Tags, catégories, recherche | Prévu | Gestion et filtrage des vêtements/tenues | À préciser |
| 10 — Outfits | Prévu | Créer des tenues à partir des vêtements, les afficher et les retrouver | À préciser |
| 11 — Images et finition | Exploratoire | Photos, UX, tests renforcés et préparation éventuelle au déploiement | À préciser |

Les sous-lots 6A à 6D forment un **chantier UI unique**, mais restent séparables en petites PR pédagogiques. Le lot 7 est délibérément reporté afin de privilégier les cours consacrés au frontend.

## Prochaine action concrète

**Lot 6B — Formulaires du compte utilisateur avec Material UI**, à partir de `dev`, sur `feat/mui-user-forms` (nom proposé).

Le lot 6A est fusionné via la PR #15. Ne pas modifier l'authentification backend ni les services API pour un changement d'apparence.

1. **6B.1 — LoginPage :** remplacer le formulaire HTML par `Paper`, `Stack`, `Typography`, `TextField` et `Button` ; préserver `useAuth().login()`, les erreurs et les transitions.
2. **6B.2 — RegisterPage :** mêmes composants et disposition ; conserver `useAuth().register()`, les champs, contraintes de saisie, états chargement et gestion des erreurs `400/409`.
3. **6B.3 — ProfilePage :** reprendre le même style pour le formulaire de profil ; préserver la mise à jour des données et le comportement lors d'une session expirée.
4. **6B.4 — Suppression et vérification :** utiliser un `Dialog` MUI pour confirmer la suppression du compte, avec libellés explicites et état de chargement. Vérifier le clavier, les erreurs affichées, l'accessibilité et le responsive.
5. Vérifier `npm run lint`, `npm run build` et les parcours login/register/profile/logout/delete dans le navigateur, puis faire une PR vers `dev`. Mettre à jour cette roadmap après fusion.

**Principes :** conserver les fichiers `components/auth/LoginPage.tsx`, `RegisterPage.tsx` et `components/user/ProfilePage.tsx`. Extraire un composant commun uniquement si un véritable besoin de réutilisation apparaît. Ne pas imposer un nouveau routeur, une bibliothèque de formulaires ou un état global supplémentaire dans ce lot.

**Lot 6C ensuite :** ajouter un service frontend `closet`, ses types et des formulaires MUI pour lister/créer/modifier/supprimer les placards. Les tests E2E Closet sont réservés à ce lot, avec vérification des droits entre deux comptes.

## Vérifications et dette technique

- **Lot 5 :** `npm run build` backend réussi le 2026-11-10 (vérification locale rapportée). Review Codex sans remarque bloquante et PR #14 fusionnée. **CRUD Closet E2E non encore validé** ; à vérifier au lot 6C.
- **Backend lint :** `npm run check` échoue actuellement sur quatre `await` inutiles dans `backend/src/repositories/clothes.repository.ts` (prototype en mémoire). Corriger ces expressions lors d'un petit correctif indépendant ; ne pas ignorer durablement l'échec de la commande globale.
- **CRUD /clothes :** en mémoire et fondé sur un ancien modèle (`type`, `style`, `isFavorite`) non aligné avec `clothing_item` SQL. À remplacer lors du lot 7, sans l'utiliser comme vraie persistance.
- **Authorization admin :** les routes `/users` et `/users/:id` sont authentifiées mais pas encore restreintes à un rôle admin ; sécuriser avant exposition publique.
- **Conflits PostgreSQL :** traiter de manière homogène les violations `23505` pour email/pseudo, y compris en accès concurrent.
- **Session / sécurité :** revoir les options de cookie, CORS, CSRF et la politique de renouvellement des tokens avant déploiement. Ne pas interpréter le fonctionnement local comme une garantie de sécurité en production.
- **Suppression en cascade :** supprimer un placard supprime ses vêtements associés selon le schéma SQL ; ajouter une confirmation UI explicite.
- **Frontend :** `ProfilePage` est incluse dans le lot 6B. Une navigation par routes pourra être envisagée plus tard à la place des booléens de vues dans `App.tsx`.
- **Vite :** exclure `.vite/` du suivi Git (cache local de préoptimisation des dépendances).
- **Tests :** pas encore de suite automatisée significative pour ce backend ; prévoir progressivement tests de services/API et vérifications de non-régression.

## Points à préciser plus tard

- Direction artistique définitive : couleurs, typographie, choix clair/sombre, identité du projet, et degré de personnalisation par l'élève.
- Règles fonctionnelles des placards : nombre maximal, placard par défaut, comportement si le dernier placard est supprimé.
- Catalogues de catégories et sous-catégories ; tags personnalisés et filtrage.
- Données d'une tenue : sélection de plusieurs vêtements, recherche, multi-placards.
- Gestion du stockage des photos et des couvertures.
- Stratégie de tests et éventuel déploiement public.

## Convention de mise à jour

Après chaque PR fusionnée dans `dev` :
1. Mettre à jour l'état du lot et ajouter la référence de PR.
2. Distinguer ce qui est **fusionné**, **testé réellement**, **en cours** ou **reporté**.
3. Actualiser la prochaine action concrète et ses critères de validation.
4. Reporter explicitement la dette technique et les décisions qui influencent les cours suivants.

Cette roadmap est un plan de travail vivant. Le code, les résultats de tests et les PR sont les preuves de l'implémentation effective. Ne pas marquer un lot « testé E2E » si seuls le build ou la review ont été réalisés.
