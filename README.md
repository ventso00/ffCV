# ScoutMetrics — pilote Madagascar en lecture seule

Documentation actuelle : docs/ARCHITECTURE.md. Les anciens parcours de saisie, import JSON personnel et restauration de données sont désactivés. Seuls les profils récupérés par le serveur après admission locale peuvent être exportés. La démo est illustrative et non exportable.

Build : npm run build. Validation : npm test, node model-tests.mjs, node pilot-tests.mjs, npm run validate. Développement : npm run dev. Les secrets et MG_PILOT_ROSTER se configurent dans l’environnement serveur.

Données : Community API pour les profils ; adaptateur MooGold optionnel pour la validation UID/pseudo seulement. Aucun paiement exécuté. Aucun partenaire réellement activé ni compte malgache importé à ce stade. Voir SOURCES.md pour l’étude initiale ; les imports déclaratifs qui y sont mentionnés ont été retirés du parcours utilisateur.

Le schéma SQL est fourni, non déployé. Les contrôles locaux et fournisseurs simulés ne constituent pas une recette terrain. L’animation est celle de la carte en perspective CSS, pas un personnage 3D.

Mise à jour 26 octobre : voir docs/AUDIT-2026-10-26.md. Saisie UID seule, résolution de région backend, deux UID admis sur déclaration. Tests supplémentaires : node uid-only-tests.mjs. Aucun profil réel extrait sans accès fournisseur.

Secours local demandé : voir docs/FALLBACK-PROTOBUF.md. Fixture réelle partielle pour JosiaBira, étiquetée local_snapshot ; aucune statistique inventée. Adaptateur HTTP de passerelle Protobuf prêt, accès en direct non validé. Tests : node fallback-tests.mjs.

## Déploiement Netlify

Le dépôt ffCV contient netlify.toml : build npm run build:netlify, dossier publié netlify-public, fonctions netlify/functions, Node 22. La fonction scoutmetrics sert le frontend et les routes API. Ne pas publier dist/ directement : ce dossier contient le backend.

Les variables fournisseur sont à configurer dans Netlify (scope Functions). Sans identifiants fournisseur, seul le secours local partiel de JosiaBira est disponible. Le rate-limit est en mémoire par instance et ne constitue pas un quota global distribué. La recherche est ouverte aux UID valides par défaut ; MG_PILOT_ROSTER est une restriction facultative. Voir docs/UID-LOOKUP-FIX.md.

Validation : npm run build:netlify puis npm run test:netlify et npm test.
