# Secours local et passerelle Protobuf

## Parcours livré

Le navigateur appelle uniquement `/api/v1/player/:id`. Le backend contrôle l’admission Madagascar, puis appelle le fournisseur sélectionné. Une réponse valide en direct est prioritaire. En cas de clé absente, d’authentification refusée, de quota fournisseur, de panne ou de réponse non exploitable, le backend peut retourner `fixtures/josiabira.json`, exclusivement pour son UID `8678687120`.

Ce JSON est une observation réelle partielle : pseudo JosiaBira vu sur Shop2Game le 26/10/2026, UID identique. Niveau, région, statistiques, personnage et image sont null. Ce fichier ne contient aucun faux score et n’est jamais utilisé pour 23146856. L’horodatage de l’observation reste inchangé ; `servedAt` indique seulement la réponse du backend. `dataMode=local_snapshot`, `live=false`, `fallbackReason` et la bannière rendent le secours explicite. Le dossier JSON exporté et le pied de la carte conservent cette provenance.

Le secours n’écrase pas un refus d’admission, un UID invalide, un 404 fournisseur ou le quota local. Il est activé par défaut pour ce pilote privé à la demande du porteur du projet. `PROFILE_TEST_FALLBACK=false` le désactive. `PROFILE_IMPORT_ENABLED=false` interdit aussi son utilisation. Le secours n’autorise pas une recharge réelle ni une validation de paiement.

## Adaptateur de passerelle

`protobuf-gateway.js` intègre côté Worker le contrat HTTP du wrapper [0xMe/FreeFire-Api](https://github.com/0xMe/FreeFire-Api). La passerelle Python reste un service séparé : elle effectue la sérialisation Protobuf, l’authentification au jeu et le décodage. Le Worker ne prétend pas exécuter Python ni disposer d’une session Garena.

Configuration serveur :

- `IDENTITY_PROVIDER=protobuf`
- `FF_PROTOBUF_BASE_URL` : origine HTTPS de votre passerelle compatible, sans identifiant dans l’URL.
- `FF_PROTOBUF_TOKEN` : secret d’accès de votre passerelle, transmis en en-tête Authorization. Protéger le wrapper par une passerelle vérifiant ce bearer ; le projet 0xMe brut ne fournit pas ce contrôle.
- Les identifiants de jeu autorisés et les schémas compilés restent dans le service Python. Ils ne doivent jamais être fournis par le visiteur du CV ni apparaître dans les fichiers frontend.

Appel : `/get_player_personal_show?uid=...&server=...&need_gallery_info=true`. Réponse JSON compatible `basicInfo.accountId`, `basicInfo.nickname` et `profileInfo`. UID source contrôlé, URL administrateur uniquement, HTTPS, redirections refusées, timeout total neuf secondes, réponse plafonnée à 200 Ko. Région inconnue : ME, SG, IND, BR, continuation uniquement après 404. Ce choix technique n’est pas une preuve du pays du joueur. Seule une réponse validée est présentée comme directe.

## Limite confirmée par test réel

Le 26/10/2026, la démo publique `freefire-api-six.vercel.app/get_player_personal_show` a renvoyé HTTP 401 et `MAJOR_LOGIN_FAILED` pour les deux UID, avec `server=me`. Elle n’est donc pas activée par défaut. Protobuf est un format de transport, pas un moyen de rendre valide un token expiré. Aucun contournement CAPTCHA ou réemploi d’une session tierce n’a été ajouté.

Le connecteur est testé avec réponses simulées ; l’extraction Protobuf en direct n’est pas validée. Le skin exact n’est toujours pas récupéré. Le secours permet de tester l’interface immédiatement, sans prétendre résoudre cette dépendance externe.

## Validation

`node fallback-tests.mjs` vérifie le secours, les valeurs inconnues, l’isolation des UID, la priorité au direct, la désactivation, les erreurs fournisseur et la confidentialité du token. Les suites précédentes restent exécutées. Le profil et les réglages du personnage restent désactivés ; la mention obligatoire est également placée sous les champs du profil.
