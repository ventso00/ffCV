# ScoutMetrics — pilote Madagascar en lecture seule

Documentation actuelle : docs/ARCHITECTURE.md. Les anciens parcours de saisie, import JSON personnel et restauration de données sont désactivés. Seuls les profils récupérés par le serveur après admission locale peuvent être exportés. La démo est illustrative et non exportable.

Build : npm run build. Validation : npm test, node model-tests.mjs, node pilot-tests.mjs, npm run validate. Développement : npm run dev. Les secrets et MG_PILOT_ROSTER se configurent dans l’environnement serveur.

Données : Community API pour les profils ; adaptateur MooGold optionnel pour la validation UID/pseudo seulement. Aucun paiement exécuté. Aucun partenaire réellement activé ni compte malgache importé à ce stade. Voir SOURCES.md pour l’étude initiale ; les imports déclaratifs qui y sont mentionnés ont été retirés du parcours utilisateur.

Le schéma SQL est fourni, non déployé. Les contrôles locaux et fournisseurs simulés ne constituent pas une recette terrain. L’animation est celle de la carte en perspective CSS, pas un personnage 3D.
