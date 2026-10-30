# Déploiement Netlify

Dépôt cible : https://github.com/ventso00/ffCV ; branche main.

Importer ce dépôt dans Netlify. netlify.toml définit :
- Build : npm run build:netlify
- Publication : netlify-public
- Fonctions : netlify/functions
- Node : 22

La fonction scoutmetrics sert les routes frontend et API. Ne jamais utiliser dist comme répertoire public : il contient le backend. Les secrets fournisseur doivent être configurés dans les variables Netlify avec le scope Functions, jamais dans le frontend.

Après déploiement, vérifier /, /api/status et /api/v1/player/8678687120. Le dernier doit afficher le mode local_snapshot si aucun fournisseur valide n'est connecté et si le secours est activé. Tester aussi un autre UID : il ne doit pas recevoir le profil JosiaBira.

Le dépôt doit être autorisé dans l'installation GitHub de Netlify. Une connexion à ff-scoutmetrics n'est pas une connexion à ffCV.
