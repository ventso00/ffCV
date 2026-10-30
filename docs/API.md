# API et configuration

Toutes les routes applicatives sont en lecture seule (GET).

| Route | Réponse |
| --- | --- |
| /api/status | Disponibilité de la source, du studio et du secours |
| /api/v1/player/:id | Profil récupéré ou erreur explicite |
| /api/profile?uid=:id | Route compatible avec le frontend historique |
| /api/v1/topup-preview/:id?diamonds=100 | Simulation sans paiement ni prix confirmé |

UID : 5 à 15 chiffres. Région technique résolue côté backend ; aucun pays déduit de l'UID. Les données absentes restent null. Le secours est réservé à 8678687120 et ne transforme pas un compte inconnu en profil valide.

Configuration serveur (voir .env.example) :
- IDENTITY_PROVIDER : community (défaut), moogold ou protobuf.
- FF_COMMUNITY_API_KEY : accès Community API.
- FF_PROTOBUF_BASE_URL et FF_PROTOBUF_TOKEN : passerelle externe.
- MOOGOLD_PARTNER_ID, MOOGOLD_SECRET, MOOGOLD_FF_PRODUCT_ID, MOOGOLD_FF_SERVER : partenaire.
- PROFILE_TEST_FALLBACK=false : désactive le secours.
- PROFILE_IMPORT_ENABLED=false : désactive les imports.
- MG_PILOT_ROSTER : JSON facultatif d'admission ; une liste vide explicite refuse tous les UID.

Erreurs : 400 entrée invalide ; 403 restriction administrative explicite ; 404 profil absent ; 429 quota ; 502/503 source indisponible ou non configurée. Aucune clé n'est exposée au client.
