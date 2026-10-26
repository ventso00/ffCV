# FF-ScoutMetrics — architecture du pilote Madagascar

Mise à jour : 24 octobre 2026.

Le produit est un générateur de CV Free Fire partageable. Les champs du profil proviennent exclusivement d’une récupération serveur. Le joueur choisit le fond, la palette et le format ; il ne corrige pas son pseudo ni ses statistiques. Une nouvelle recherche peut produire une version plus récente du profil.

## Architecture retenue

Conserver le frontend HTML/CSS/JavaScript existant, Canvas pour les exports et CSS pour la perspective animée. Le backend est un Cloudflare Worker JavaScript, déjà déployable par Sites. Ce choix évite une migration inutile vers React/Next pour ce pilote. Un service navigateur Playwright séparé serait nécessaire pour une alternative par UI : Chromium ne tourne pas dans ce Worker.

Flux : formulaire UID → admission Madagascar côté serveur → limite de requêtes → adaptateur de données → normalisation → profil en lecture seule → composition du CV → export PNG/PDF. L’identité et les statistiques sont deux capacités distinctes.

## Madagascar : règle réellement appliquée

Aucun préfixe d’UID « malgache » n’a été établi. Les régions de service Garena regroupent des territoires ; ME ne signifie pas Madagascar. La localisation IP décrit une connexion, pas la nationalité ni l’appartenance géographique du compte. Voir [les régions Garena](https://ffsupport.garena.com/hc/en-us/articles/4412920947866-Free-Fire-Customer-Service-Teams) et [la géolocalisation Cloudflare](https://developers.cloudflare.com/network/ip-geolocation/).

Le pilote fonctionne donc sur admission locale : un administrateur vérifie la participation du joueur à Madagascar et son UID, puis configure MG_PILOT_ROSTER côté serveur. Par défaut la liste est vide et tout UID est refusé. Le programme ne qualifie jamais automatiquement un compte de « malgache » sur son serveur de jeu.

Format de configuration illustratif, avec UID de test uniquement :

```json
{"12345678":{"country":"MG","status":"approved","region":"sg"}}
```

Aucun utilisateur ne peut s’inscrire dans cette liste depuis le navigateur. Une vérification locale et un accès fournisseur réel restent à effectuer. La solution vise un pilote admis à Madagascar, pas une preuve automatique de nationalité.

## Endpoints implémentés

- GET `/api/v1/player/:id?region=sg` : contrôle l’admission et le serveur puis récupère le profil. Le serveur peut être omis : celui approuvé est utilisé. Retourne le pseudo et les champs disponibles, la source et l’horodatage. Avec MooGold, les statistiques restent null et `admission` indique MG_PILOT_APPROVED.
- GET `/api/profile` : ancienne route protégée par les mêmes contrôles, pour éviter un contournement.
- GET `/api/v1/topup-preview/:id?diamonds=100` : revalide le destinataire et renvoie une simulation avec `price:null`, `paymentEnabled:false`. Aucun endpoint de création de commande n’est appelé.
- POST, PATCH et PUT ne permettent pas de changer un profil.

Exemple d’appel :

```js
const response = await fetch('/api/v1/player/12345678');
const result = await response.json();
if (!response.ok) throw new Error(result.message);
// Le pseudo vient de result.nickname ; aucune valeur de profil envoyée par le client.
```

## Sources et configuration

Source de statistiques : l’adaptateur Community API existant utilise FF_COMMUNITY_API_KEY. L’échec d’authentification ne produit jamais un profil fictif.

Source de validation d’identité : sélectionner IDENTITY_PROVIDER=moogold et configurer MOOGOLD_PARTNER_ID, MOOGOLD_SECRET, MOOGOLD_FF_PRODUCT_ID et, si nécessaire, MOOGOLD_FF_SERVER. L’ID de produit doit être vérifié dans le catalogue du compte partenaire. Le code signe les requêtes avec Basic Auth, HMAC-SHA256 et timestamp conformément à la [documentation MooGold](https://doc.moogold.com/). Il appelle seulement `product/validate`. Ses réponses ne sont pas utilisées comme statistiques de jeu. Intégration testée sur réponses simulées ; pas de compte partenaire activé ni de validation réelle à ce jour.

Codashop/UniPin : ne pas inventer d’endpoint revendeur ni supposer des droits d’accès. Intégrer après réception et vérification du contrat d’API du partenaire choisi.

Shop2Game : le fichier `alternatives/shop2game.mjs` fournit un squelette Playwright séparé. Les sélecteurs doivent être vérifiés sur le parcours autorisé ; il n’a pas été testé sur le site réel. Il conserve une session normale et s’arrête sur CAPTCHA, 403 ou 429. Aucun contournement de CAPTCHA, dissimulation d’automatisation ou rotation destinée à éviter une restriction n’est implémenté. Une page publique ne constitue pas, à elle seule, une interface contractuelle fiable pour le produit.

## Base de données et intégrité

`docs/schema.sql` propose les tables admissions, snapshots immuables, historique, designs, simulations et limitation distribuée. Ce schéma est livré mais aucune base n’est provisionnée dans cette version ; le pilote utilise la liste serveur et un cache de cinq minutes. Le frontend n’est jamais une source d’autorité. Les données ne sont pas restaurées depuis les anciens brouillons ou fichiers JSON personnels.

Pour une ouverture publique : déployer cette base, enregistrer un snapshot par collecte et produire un lien de vérification associé à chaque CV. Une image PNG téléchargée peut toujours être retouchée hors de l’application ; seul le lien vers un snapshot serveur peut permettre de contrôler son authenticité. Une donnée provenant d’un fournisseur reste susceptible d’être incomplète ou périmée : lecture seule ne veut pas dire certification Garena.

## Sécurité et validation

Clés exclusivement serveur, URL fournisseur fixe, entrée UID contrôlée, réponses normalisées, délais de neuf secondes, absence d’achat automatisé, cache non accessible par route publique. Limite actuelle : six recherches par minute/IP dans un isolate. Elle protège le pilote privé mais n’est pas une limite distribuée globale. Avant ouverture publique, utiliser un stockage partagé/Durable Object ou une règle de plateforme ; ajouter la limitation par compte et les quotas fournisseur.

Tests : admission refusée par défaut, UID approuvé et région liée, protection des deux routes, refus de POST, signature partenaire, statistiques absentes non inventées, simulation n’appelant jamais Create Order. Les tests d’adaptateurs sont simulés, pas une recette terrain à Madagascar.
