# Architecture actuelle

Le frontend utilise HTML, CSS et JavaScript natif. frontend/app.js consomme /api/v1/player/:id sur la même origine. shared/profile-model.js normalise les données et calcule les indications de présentation.

backend/server.js contient le routeur et les réponses HTTP. backend/services/pilot-policy.js gère la restriction administrative facultative et la validation MooGold. backend/services/protobuf-gateway.js appelle une passerelle HTTP externe ; il n'émule pas lui-même le client de jeu. backend/fixtures/josiabira.json conserve l'observation partielle datée. backend/experimental/ contient un ancien prototype de collecte, absent du build de production.

scripts/build.mjs assemble ces modules et les ressources dans dist/server/index.js. Les sources backend utilisent les symboles injectés par cet assemblage et ne sont pas destinées à être exécutées isolément. Les URL publiques /app.js, /style.css et /profile-model.js restent stables malgré le déplacement des fichiers sources.

netlify/functions/scoutmetrics.mjs adapte Request/Response et les variables serveur à Netlify. L'adresse IP vient du contexte Netlify. Le quota en mémoire est par instance, pas distribué. Aucun cache durable ou stockage SQL n'est activé.

Les données compilées, .env et l'état local Netlify sont ignorés par Git. .openai/hosting.json reste conservé pour la compatibilité avec l'ancien hébergement Sites. L'application existante sur Sites n'est pas redéployée par cette restructuration.
