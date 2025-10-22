# Movie Finder

> Projet d’entrée en matière pour valider les fondamentaux React.

Movie Finder est un premier projet personnel bâti sur React + Vite. Je suis parti d’un tutoriel de [JavaScript Mastery](https://www.youtube.com/watch?v=dCLhUialKPQ) que j’ai progressivement adapté pour apprendre en autonomie et poser une base saine dans mon portfolio :

- Backend Appwrite en utilisant la nouvelle API **Tables** plutôt que les anciennes collections.
- Gestion de l’authentification (inscription / login) avec état global et pages privées.
- Ajout d’un système de favoris persistant (Appwrite + TMDB) réutilisable via un hook partagé.
- Déploiement continu via **Vercel**.

## Fonctionnalités

- Recherche de films via l’API TMDB avec debounce pour limiter les appels.
- Mise en cache des tendances Appwrite, masquées lorsque l’utilisateur recherche activement.
- Ajout/retrait de favoris synchronisés entre Appwrite et l’interface (hook réutilisable + bouton dédié).
- Page profil privée affichant les favoris enrichis par TMDB.

## Pile technique

- **Front** : React 19, Vite, Tailwind CSS (hooks personnalisés, routes privées).
- **Backend BaaS** : Appwrite (TablesDB, requêtes/mutations via SDK Web).
- **Déploiement** : Vercel (environnements Preview & Production, variables `VITE_*`).

## Installation

```bash
npm install
npm run dev
```

Créer un fichier `.env.local` et y ajouter :

```
VITE_TMDB_API_KEY=<clé TMDB v4 Bearer>
VITE_APPWRITE_PROJECT_ID=<id projet Appwrite>
VITE_APPWRITE_DATABSE_ID=<id base Appwrite>
VITE_APPWRITE_TABLE_NAME=<table metrics>
VITE_APPWRITE_FAVORITES_TABLE_NAME=<table favorites>
```

### Déploiement Vercel

1. `vercel login` puis `vercel link` dans le dossier du projet.
2. Déclarer les variables (production & preview) avec `vercel env add`.
3. `vercel --prod` pour lancer la build et publier.
4. Dans la console Appwrite, autoriser le domaine Vercel (Settings → Platforms).
5. **Production** : https://netflix-six-pearl-90.vercel.app/

👉 Visualisation directe : https://netflix-six-pearl-90.vercel.app/

### Workflow Git

- Repo versionné sur GitHub (portfolio).
- Commit fréquents documentant les étapes (config Appwrite, refonte TablesDB, déploiement Vercel…).
- Utilisation de branches pour tester les évolutions avant merge vers `main`.
- Déploiements Preview Vercel associés à chaque PR pour valider les changements.

## Objectifs

Ce dépôt incarne mon premier projet React « sérieux ». L’objectif est double :

1. **Valider les fondamentaux** : lifecycle hooks, gestion d’état global, appels API, routing, animations légères.
2. **Structurer une base saine** : documentation claire, code commenté avec parcimonie, et architecture prête à évoluer (hook favoris, contexte d’auth, composants réutilisables).

La suite envisagée : tests automatisés, raffinements UI (animations sur les favoris, skeleton loading) et itérations sur les bonnes pratiques que je découvrirai au fur et à mesure.
