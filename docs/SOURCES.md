# FF-ScoutMetrics — sources et stratégie de collecte

Vérification documentaire du 23 octobre, contrôles HTTP du 24 octobre 2026. Aucun compte malgache authentifié n’a été testé. Ce document distingue les capacités annoncées, le code observé et les essais effectués.

## Ce qu’il faut corriger dans le rapport initial

La validation d’un UID sur une plateforme de recharge ne démontre pas l’accès au niveau, à la guilde, au K/D ou au taux de headshots. Codashop décrit la confirmation du pseudo et de l’ID avant paiement. Le code communautaire de validation consulté renvoie principalement un pseudo et un état de validité. Il ne justifie pas une extraction complète des statistiques.

`get_player_personal_show` est le nom d’une fonction Python communautaire. Elle appelle `GetPlayerPersonalShow`, avec authentification et messages Protobuf. Le paramètre `needGalleryInfo` existe dans ce code. Il ne suffit pas à prouver que tous les objets possédés sont accessibles pour n’importe quel UID. Tenue équipée, galerie exposée et inventaire complet sont trois périmètres différents.

## Sources examinées

| Source | Utilité établie ou annoncée | Accès et état | Décision pour le projet |
|---|---|---|---|
| [Free Fire Community API](https://developers.freefirecommunity.com/en/docs) | Profil, rangs, guilde, familier, identifiants de tenue dans le schéma documenté | Clé serveur. Requête sans clé : HTTP 401, AUTH_001 le 24/10 | Adaptateur principal déjà présent, normalisation étendue. Import réel bloqué tant que l’accès n’est pas activé |
| [Documentation Community](https://docs.freefirecommunity.com/) | Endpoints séparés `/stats` pour les performances et `/image` pour les visuels | Capacités annoncées ; réponses authentifiées non validées pendant ce travail | Prochaine intégration après validation du schéma et du serveur réel. Ne pas dériver le K/D à partir du niveau |
| [Codashop](https://br.support.codashop.com/hc/en-us/articles/360003977856-How-to-purchase-diamonds-on-Free-Fire) | Confirmation ID/pseudo dans le parcours d’achat | Site de recharge, aucune API statistique établie ici | Source éventuelle de résolution d’identité, pas de métriques compétitives ; aucune commande de paiement créée |
| [php-valid-game](https://github.com/triyatna/php-valid-game) | Code de validation via Codashop/GoPay, extraction du pseudo | Bibliothèque tierce, pas un contrat d’API officiel | Preuve du périmètre limité ; ne pas utiliser `initPayment` comme collecte statistique |
| [UniPin](https://developer-docs.unipin.com/) | Portail développeur de paiement/recharge | Documentation détaillée non validée dans cette recherche | Aucun K/D, headshot ou inventaire démontré ; ne pas annoncer cette source comme connectée |
| [0xMe / FreeFire-Api](https://github.com/0xMe/FreeFire-Api/blob/main/Api/InGame.py) | Appel communautaire `GetPlayerPersonalShow` et option galerie | Endpoint du jeu authentifié, dépendant du protocole et de sa version | Référence technique uniquement. Aucun jeton de jeu obtenu, aucun trafic d’un tiers intercepté |
| [ravi252 / Freefireapi](https://github.com/ravi252/Freefireapi) | Passerelle `api2.nftoken.info` annonçant profils sans clé et détection de région | Test `/player-info` sur l’UID exemple 10000001 : délai dépassé à 10 s le 24/10 | Pas assez fiable pour un repli automatique ; panne ponctuelle, pas preuve d’arrêt définitif |
| [FFData](https://ffdata-web.vercel.app/) | Ancien fournisseur de profils | La page consultée annonce l’arrêt du service | Écarté |
| [Catalogue officiel des personnages](https://ff.garena.com/en/chars) | Noms et descriptions des personnages | Catalogue général, pas l’équipement d’un UID | Utile pour une correspondance visuelle future ; ne prouve pas le personnage de Bob |
| Captures et exports fournis par le joueur | Personnage exact visible, statistiques affichées, informations de recrutement | Import local, provenance déclarée | Repli disponible : image et JSON. OCR et vérification de captures non implémentés |

## Collecte et analyse retenues

1. UID + serveur explicite → connecteur serveur avec délai et contrôle d’UID.
2. Normalisation des seuls champs connus ; valeurs absentes conservées inconnues.
3. Dossier avec provenance champ par champ et date de collecte ; export JSON.
4. Statistiques de matchs à ajouter depuis une source validée : mode, saison, période, parties, kills, morts, victoires, headshots. Calculer seulement les ratios dont les dénominateurs et la définition sont connus. Ne pas comparer des saisons ou modes différents.
5. CV dynamique : informations disponibles, personnage fourni par le joueur, inspiration graphique et réglages manuels.
6. Animation de la carte en perspective 3D CSS. Le personnage reste une image 2D ; un vrai avatar 3D exige un modèle et une correspondance des équipements validés.

Le choix de palette par niveau est une règle de présentation : moins de 30 = Arctic ; 30–59 = Solar ; 60 et plus = Neon. Ce n’est ni un rang officiel ni une mesure de talent. La complétude indique les champs renseignés, pas leur fiabilité.

## Recette Madagascar à effectuer

Le pays du joueur ne suffit pas à déduire le serveur de son compte. Vérifier plusieurs comptes volontaires avec leur serveur affiché dans le jeu, comparer les champs importés aux captures, mesurer les délais sur connexion mobile et tester les téléchargements/partages sur Android. Tester aussi source indisponible, quota atteint, champ absent et brouillon hors connexion.

Le pilote ne peut être déclaré validé sur le terrain avant ces essais. L’accès fournisseur et un UID réel avec son serveur restent nécessaires pour terminer cette validation. Aucune clé secrète ne doit figurer dans le navigateur, le dépôt ou un message de chat.
