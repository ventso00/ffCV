# ScoutMetrics Player Studio — pilote privé v0.3

Landing SaaS gaming, CV éditable en calques, aperçu en perspective CSS, export PNG/PDF et base PWA Android. Le personnage conceptuel et les statistiques d'exemple sont explicitement fictifs. Le relief est un effet de carte 3D CSS ; aucun modèle 3D du personnage n'est chargé.

## Développement et validation

- `python3 assemble.py` : compile HTML/CSS/JS et images optimisées dans le Worker autonome.
- `npm test` : 31 tests backend, avec réponses fournisseur simulées pour les parcours authentifiés.
- `npm run build` puis `npm run validate` : valide l'artefact Sites.
- `npm run dev` : serveur local utilisant le vrai Worker. `/mobile-check` sert seulement au contrôle responsive ; cette route n'est pas déployée.

Aucune dépendance npm externe. Utilisation de Canvas 2D, CSS, Web Share et Service Worker natifs. Exports PNG 1080×1350 / 1080×1920 / 1080×1080. PDF raster incorporant la carte ; ce n'est pas un CV textuel ATS.

## Import réel

Configurer `FF_COMMUNITY_API_KEY` comme secret d'environnement Sites puis redéployer. `PROFILE_IMPORT_ENABLED=false` désactive explicitement l'import ; sa présence n'est pas requise pour activer une clé valide. Aucun secret côté navigateur. Fournisseur actuel : https://developers.freefirecommunity.com/api/v1/info, entête `x-api-key`, UID et région explicites.

Le test direct sans clé a répondu 401 AUTH_001. Aucun compte authentifié n'a été importé pendant cette intervention. Une clé valide doit encore être testée avec un UID et son serveur réellement connus. La région ME proposée ne garantit pas le serveur d'un compte malgache. Aucun accès aux mots de passe, messages, identité civile ou autre donnée privée.

Contrôles : UID exact, pseudonyme non vide, nombres valides ou null, taille de réponse plafonnée à 200 Ko, délai de 9 s, erreurs fournisseur explicites, cache serveur 5 minutes. Limite 6 recherches/minute/IP dans la mémoire d'un isolate : protection de proximité, non globale et non durable. Ajouter une vraie limitation distribuée avant ouverture publique et suivre les quotas fournisseur.

## Personnage réel

Aucun service de rendu de tenue n'a passé une validation réelle. `characterImage` reste null. L'UID ou un ID d'avatar ne suffit pas à reconstruire la tenue exacte. Le joueur peut importer sa propre image PNG/JPEG/WebP (5 Mo, 16 Mpx maximum), puis ajuster taille et position localement. Le personnage d'exemple n'est jamais substitué à celui d'un profil importé.

## Données locales et Android

Le brouillon est enregistré explicitement dans localStorage. L'image n'est pas conservée après rechargement et doit être réimportée. Les informations restaurées sont traitées comme déclarées. Les données démo sont vidées à la première modification pour éviter toute contamination des vrais CV. Les API ne sont pas mises en cache par le Service Worker. Le manifeste et les icônes permettent une installation PWA dans un navigateur compatible ; installation physique Android, APK signé et publication Play Store restent à réaliser/valider.

## Contrôles effectués

31 tests serveur réussis. Vérifications UI : import sans clé et repli, saisie des champs, image locale, formats Post/Carré/Story, thème Neon, brouillon enregistré et restauré, réduction d'animations. Responsive à 375 px utiles : scrollWidth = clientWidth après correction du débordement décoratif. Structure du PDF produite par le sérialiseur réel validée par pdfinfo/Poppler sur image de test.

Limite QA : le navigateur cloud n'a pas remis les téléchargements au contrôleur. La génération et les liens existent dans l'UI, mais l'enregistrement final PNG/PDF et le partage Android demandent une recette sur appareil. Ne pas annoncer une validation terrain Madagascar ni un import authentifié réussi.
