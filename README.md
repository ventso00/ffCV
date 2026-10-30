# FF CV — ScoutMetrics Madagascar

Application de création de CV Free Fire en lecture seule. L'utilisateur saisit son UID, sans choix de serveur ; le backend interroge la source configurée. Le design du CV reste personnalisable, les informations du joueur et son personnage sont verrouillés.

## Organisation

| Dossier | Responsabilité |
| --- | --- |
| frontend/ | Page, interactions, styles, images et polices |
| backend/ | Routes HTTP, services fournisseurs et secours local |
| shared/ | Normalisation et analyse du profil partagées |
| netlify/functions/ | Adaptateur serveur Netlify |
| database/ | Schéma SQL proposé, non déployé |
| tests/ | Tests API, données, admission, secours et Netlify |
| scripts/ | Build, serveur local et exécution des tests |
| docs/ | Architecture, déploiement, API et rapports |
| dist/ | Backend généré, ignoré par Git |
| netlify-public/ | Répertoire public généré pour Netlify |

## Démarrage

Node.js 22 ou supérieur. Aucune dépendance npm à installer pour le développement local.

1. Copier .env.example vers .env si nécessaire.
2. Lancer npm run dev.
3. Ouvrir http://localhost:4173.

## Commandes

- npm test : reconstruit le backend et lance toutes les suites.
- npm run build:netlify : prépare le backend et le répertoire public.
- npm run validate : vérifie le module serveur généré.

## État réel des données

Sans accès fournisseur, seul le secours local partiel de JosiaBira (UID 8678687120) est disponible. Il est daté, explicitement signalé et ne contient ni statistiques ni personnage inventés. Les autres UID nécessitent une source configurée. Un UID ne prouve pas une localisation à Madagascar.

La recharge est une simulation sans paiement. Le schéma SQL n'est pas connecté à une base active. La présentation animée concerne la carte, pas un modèle 3D du personnage.

## Documentation

- [Architecture actuelle](docs/PROJECT-STRUCTURE.md)
- [Déploiement Netlify](docs/DEPLOYMENT.md)
- [API et configuration](docs/API.md)
- [Étude des sources](docs/SOURCES.md)
- [Secours et passerelle Protobuf](docs/FALLBACK-PROTOBUF.md)

Les rapports datés conservent l'historique du projet ; leurs anciens chemins et commandes peuvent avoir changé.
