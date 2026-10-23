# FF ScoutMetrics — Identity Studio V0.2

Prototype privé issu des deux références visuelles fournies par Ventso. Ce dépôt est un complément à FF_ScoutMetrics_Dossier_Master_V2.md, pas une implémentation du recrutement complet.

## Réalisation
- Landing responsive, fond sombre, lime/rose/bleu, perspective CSS et mouvement réduit.
- Dialogue de profil et source visible ; aucune requête réelle remplacée par la démo.
- Carte à effet 3D, sélection couleur, illustration conceptuelle initiale, import local de personnage.
- PNG 1080×1350 via Canvas ; impression PDF navigateur ; Web Share avec repli téléchargement.
- PWA avec manifeste, icônes PNG et service worker excluant les réponses API.
- Connecteur serveur public Free Fire Community API, désactivé par défaut, normalisation stricte et erreurs typées.

## Construire et vérifier
Le Worker déployable est déjà suivi dans worker/index.js et ne dépend d’aucun package externe.
Pour régénérer après modification : `python3 assemble.py` (Python standard uniquement).
`node --check app.js`
`node tests.mjs` : 20 tests serveur, fournisseur simulé.
`bash scripts/build.sh`
`node scripts/validate-artifact.mjs`

L'image assets/concept-reference.jpg est la référence utilisateur incorporée comme illustration de démonstration, pas un asset Free Fire certifié. Confirmer les droits avant diffusion publique. Les icônes sont générées localement. Ne pas exposer qa/ : copie statique temporaire servant uniquement la vérification UI, sans backend.

## Activation des données réelles — non effectuée
1. Obtenir un accès fournisseur qui permet l’usage prévu, la conservation et l’affichage ; aucun compte ou achat n’a été effectué.
2. Tester UID + serveur sur comptes de volontaires et comparer avec le jeu, dont un compte réellement utilisé à Madagascar. Le serveur n’est pas inféré du pays.
3. Configurer uniquement côté serveur FF_COMMUNITY_API_KEY et PROFILE_IMPORT_ENABLED=true.
4. Fournir une liaison de limitation de débit PROFILE_RATE_LIMITER compatible avec `.limit({key})` et configurée côté hébergement. Le connecteur refuse autrement de démarrer. Aucun mapping automatique de cette liaison dans Sites n’est livré : valider son support ou utiliser un mécanisme durable équivalent avant activation.
5. Définir les budgets, consentements et protections d’accès ; rejouer les tests et réaliser la recette source réelle. Ne pas activer sur la seule présence de la clé.

GET /api/profile?uid=...&region=sg|ind|br|me|eu|bd|pk. UID 5–15 chiffres : règle syntaxique spécifique au fournisseur, pas preuve d'existence. La liste régionale doit être validée par le fournisseur avant ouverture. Une requête /info seulement ; pas de stats détaillées ou de récupération de comptes privés. Le serveur conserve UID en chaîne et n'exporte qu'une liste blanche : UID, pseudo, serveur, niveau, points BR, likes, guilde et provenance. Aucune déduction du rang par nom, du K/D, de la propriété, du talent ou du véritable personnage 3D.

## Android
La PWA nécessite HTTPS et un navigateur compatible ; installation physique et hors connexion non validées sur Android. L’accès privé peut limiter l’installation. Aucun APK signé construit. Étape suivante : empaquetage Capacitor, Android Studio, cible Android conforme aux règles Google Play en vigueur, tests appareils, signature puis distribution choisie. Ne jamais embarquer une clé API dans l’APK.

## Limites du prototype
Pas de comptes, publication persistante de profils, stockage DB, vérification de propriété, historique, recrutement, PDF serveur ni personnage 3D réel. UI testée dans Chrome desktop ; CSS responsive écrit mais pas validé sur appareil Android physique. Import réel non testé sans accès fournisseur. Aucun niveau d'exactitude absolu promis.
