# Historique des versions — Je parle baguette · 我说法棍

Chaque version publiée est une **étiquette Git** (`v1.0`, `v2.0`…) et une **Release GitHub** (onglet *Releases* du dépôt : notes + archive téléchargeable).
Le site (GitHub Pages) affiche toujours la dernière version de la branche `main`.

**Relire ou récupérer une ancienne version**
```bash
git checkout v5.1            # voir le code de la version 5.1 (lecture seule)
git checkout main            # revenir à la dernière version
```
**Revenir en arrière sur le site** : republier le contenu d'une étiquette (`git checkout v5.1 -- index.html dicebear.js`, puis commit et push). L'historique n'est jamais réécrit : rien n'est perdu.

**Règle de publication** : on travaille en local ; quand la version est validée, un commit est poussé, une étiquette `vX.Y` est posée et une entrée est ajoutée ici.

---

## v6.23 — 2026-10-21 — Badge fondateur

- Qui sommes-nous : badge 👑 « Fondateur » sur la carte du fondateur.

---

## v6.22 — 2026-10-21 — Concepteur de fiches de grammaire, avatars dans les messages, visage par défaut

- **Concepteur de fiches de grammaire** (administrateurs) : mise en page par blocs (titre, texte, exemple avec audio, astuce, image) sur une grille de 12 colonnes ; largeur ⅓ · ½ · ⅔ · 1/1 et alignement en un clic ; déplacement par glisser-déposer ou flèches ; images par glisser-déposer, collage ou import (réduites automatiquement) ; bouton « Ranger » pour l'alignement automatique ; aperçu avant enregistrement. Les anciennes fiches s'ouvrent dans le concepteur.
- **Messagerie** : avatar de chaque personne (au lieu de l'emoji), pseudo et avatar toujours à jour.
- **Visage par défaut** : retour du sourire et du regard droit (les valeurs par défaut étaient décalées d'un cran) ; les avatars touchés par ce décalage sont réparés.
- Qui sommes-nous : bouton unique « Ajouter un membre » pour les administrateurs ; tirelire 🐷 sur le bandeau Soutenir.
- Serveur : les fiches acceptent des blocs et des images (jusqu'à 1,5 Mo) ; les cartes de messagerie renvoient l'avatar.

---

## v6.21 — 2026-10-21 — Forum simplifié, messagerie en deux colonnes, feuille de route en frise

- **Forum** repensé : recherche, onglets de catégories, filtres Récentes / Populaires / Sans réponse / Mes discussions, une ligne par discussion ; modération repliée ; zone de réponse intégrée à la page ; formulaire de nouvelle discussion simplifié.
- **Messagerie** : sur grand écran, conversations à gauche et conversation ouverte au centre.
- **Prononciation** : menu du bas aligné sur celui de l'application (Parcours, Ressources, Communauté, Profil).
- **Qui sommes-nous** : feuille de route en frise horizontale (flèches, points, légende ; terminé / en cours / à faire), étapes « Niveau A1 », « Cours de prononciation » et « Ajouter l'anglais » ; ordre : équipe, feuille de route, soutenir, contribuer.
- Pages de la communauté plus larges sur grand écran, adaptées au mobile.
- **Grammaire** : les fiches fournies avec l'application sont retirées (les administrateurs ajoutent les leurs).
- Serveur : aucun changement.

---

## v6.20 — 2026-10-21 — Soutenir le projet et feuille de route

- Page **Soutenir le projet** : projet bénévole et non lucratif, dons facultatifs (Stripe, WeChat Pay, Alipay, PayPal…), frais couverts, badge 💛 « Généreux donateur » affiché dans « Qui sommes-nous » (nom ou anonyme). Moyens de don, frais et donateurs gérés par les admins.
- « Qui sommes-nous » : **feuille de route** (grammaire simplifiée, niveau A2, interface graphique, vos idées) ; Linguistes et Orthophonistes ajoutés aux contributeurs recherchés.
- Serveur : points d'accès `donate` (lecture publique, écriture admin).

## v6.19.1 — 2026-10-21 — Mise à jour immédiate

- Les fichiers du module Communauté sont maintenant rechargés dès qu'une nouvelle version est publiée (plus d'ancien menu du haut en cache pendant 10 minutes).

## v6.19 — 2026-10-21 — Interface épurée, forum, grammaire, Qui sommes-nous

- En-tête épuré : plus de XP, série ni nuage de synchronisation (alerte seulement en cas d'échec) ; boutons **Classement** et **Qui sommes-nous** bien visibles ; icône admin.
- Accueil : quêtes du jour repliables ; Ressources = Prononciation + Grammaire (nouvelle icône) ; Communauté = Forum + Boîte de messages.
- Forum à la manière d'un vrai forum : colonne auteur avec avatar, numéros de messages, citation, bouton flottant sur mobile.
- **Grammaire** : 25 fiches A1/A2 en français et en chinois (exemples audio), modifiables par les admins.
- **Qui sommes-nous** : présentation du projet, contributeurs (photo, fonction, liens au choix : LinkedIn, GitHub, site…), gestion réservée aux admins.
- Visage par défaut souriant (les anciens avatars créés avec le défaut « en colère » sont réparés) ; l'aperçu de l'avatar s'affiche dès la première modification.
- Images non glissables (pas de menu « enregistrer l'image »).

## v6.18 — 2026-10-21 — Avatar retrouvé sur un autre navigateur

- Correction : sur un navigateur neuf, la synchronisation ne reprenait pas l'avatar, les tenues ni les réglages de personnage du serveur (et pouvait les remplacer par un avatar vide). La version la plus récente gagne maintenant ; un navigateur sans avatar récupère celui du serveur. Les jours de connexion sont réunis.

## v6.17 — 2026-10-21 — Communauté, Ressources, rôles à l'inscription

- Nouvelle barre du bas : Parcours · Ressources · Communauté · Profil. Le Salon est désactivé (code conservé).
- **Communauté** : forum (annonces, suggestions, bugs, aide, cours & contenus, discussion libre ; niveaux A1/A2/B1 ; statuts ; votes ; solution ; épinglage, verrouillage, déplacement ; règles à accepter), Messages, Classement et page **Projet** (open source, contributeurs, équipe avec fonction et lien LinkedIn).
- **Ressources** : Grammaire (fiches FR/中文 avec exemples audio, éditeur pour les admins) + Prononciation.
- Signalement rapide d'une question ou d'une traduction (une feuille, 5 motifs).
- Inscription : rôles Élève / Apprenant libre / Professeur ; l'élève choisit son professeur dans la liste puis sa classe ; le professeur indique son établissement dans sa demande de droits.
- Serveur (api.php) : forum, grammaire, équipe, propriétaire des classes, liste des professeurs (admins ayant une fiche d'équipe + le premier admin). Aucune donnée d'élève modifiée.

## v6.16 — 2026-10-15 — Canapé et personnages 3D

- Canapé découpé en 3 places triées avec les personnages (plus de mauvaise superposition), coussins alignés, accoudoir droit au premier plan.
- Personnage 3D : jambes pliées en position assise, drapeau chinois agrandi, rendu corps 90 % / objet 95 %.

## v6.15 — 2026-10-15 — Personnages en vraie 3D (Three.js)

- Salon : les personnages sont rendus en 3D avec Three.js (tête sphérique avec le vrai visage, cheveux en volume, corps arrondi, ailes, capes, couronnes et auréole en polygones, objets tenus en polygones, auras en particules 3D animées), sur 8 directions, légèrement pixelisés (corps 90 %, objet 95 %). Retour automatique à l'ancien rendu si le WebGL n'est pas disponible.
- Pseudos, badge ADMIN et bulles : dessinés sur un calque net à la résolution de l'écran (plus de pixelisation).
- Menu admin du salon : réglages 3D et « Labo 3D » (aperçu isolé avec curseurs).
- Nouveaux fichiers : `lab3d.js`, `three.min.js` (Three.js r160).

## v6.14 — 2026-10-15 — Cadeau du jour

- Le cadeau s'affiche uniquement à la connexion (compte connecté) ; calendrier limité à 7 jours ; l'objet gagné est visible dans l'aperçu.

## v6.13 — 2026-10-14 — Tête et objets en volume
- Salon : la tête du personnage est maintenant plaquée sur un volume qui tourne avec lui (8 directions) ; les objets tenus ont de l'épaisseur et tournent aussi.

## v6.12 — 2026-10-14 — Salon 3D, protection contre l'aspiration
- **Salon** isométrique : plein écran, chat (Entrée), s'asseoir (canapé, tapis), personnages en vraie 3D à 8 directions qui suivent la souris (tête, vêtements, ailes, aura animée en lumière, objets tenus, badge du Parti).
- Messages : pastille de notification, icône ✉️ dans le classement ; profil : couleur de l'habit, calendrier du cadeau du jour, badge ADMIN.
- **Anti-aspiration** : pages en `noindex`, `robots.txt` ; serveur : classement visible seulement avec un compte, limite de 240 requêtes/min par adresse IP.
- `server/api.php` : salon (assis, admin, grande pièce), nom de connexion dans le classement, limitation de débit.

## v6.11 — 2026-10-14 — Salon, messagerie, Mon personnage
- **Salon** : pièce vue du dessus, avatars pixelisés qui marchent et parlent (bulles), entrée depuis l'accueil.
- **Messages** (barre du bas, à la place de « Réviser ») : conversations entre usagers, blocage, signalement.
- **Mon personnage** : équipement et inventaire sur la même page (6 emplacements, pages selon la taille de l'écran, objets de départ + objets de collection avec cadenas, couleur de l'habit), badge ADMIN animé.
- **Mon visage** : visage seul, plus compact ; le hasard ne change plus tenue/lunettes/objets ; les objets de collection ne s'y choisissent plus.
- **Calendrier du cadeau du jour** : jours présents/manqués, indice de rareté des prochains cadeaux ; raretés par origine (séries 7/30 jours, podium du mois).
- **Admin** : onglet Admins (nommer/retirer), signalements, demandes de droits ; inscription : question « élève de Baptiste ? ».
- Prononciation : barre du bas, couleurs de l'appli. `server/api.php` : messagerie, salon, signalements, demandes admin.

## v6.10 — 2026-10-14 — Signaler une erreur
- Bouton « ⚑ Signaler » dans les quiz et les cartes : l'élève connecté signale un mot ou un élément à corriger (note facultative, 10 par jour max).
- Admin : nouvel onglet « Signalements » avec bouton « Traité ».
- `server/api.php` : stockage des signalements (`report`, `reportdone`).

## v6.9 — 2026-10-14 — Page Prononciation, inscription, admin
- Nouvelle page **Prononciation** (bouton 🗣️ « Sons » dans la barre du bas) : cours, bouches, exercices, voix Denise en fichiers statiques (`prononciation/`), aux couleurs de l'appli ; admin = tous les niveaux débloqués.
- Inscription : question obligatoire « Es-tu élève de Baptiste ? » (classe si oui ; sinon utilisateur libre ou demande de droits admin, validée dans Admin → Élèves).
- Profil admin : case « ligne dorée dans le classement » ; les administrateurs ont une ligne dorée au classement.
- `server/api.php` : demandes de droits admin (`reqadmin`/`denyreq`), indicateur admin dans le classement.

## v6.8 — 2026-10-11 — Équipement façon RPG, raretés, NEW
- Nouvelle vue **⚔️ Équipement** : personnage en grand, 9 emplacements, objets possédés par emplacement, port/retrait en un clic.
- Raretés : cadeau du jour jamais super rare ; série de 7 jours = rare (2 % super rare) ; série de 30 jours = super rare ; podium du mois : 1er épique, 2e super rare, 3e super rare/rare, puis rare/commun.
- Pastille **NEW** sur les objets gagnés jamais portés.
- Test local : `?unlock=1` (uniquement sur localhost) débloque tout.

## v6.7 — 2026-10-11 — Quiz : pas de mots non vus
- Les fausses réponses ne viennent plus que du chapitre courant et des précédents (plus de « mon / ma » dans le premier quiz).
- `server/api.php` : même règle pour les quiz de fin de chapitre (à déployer sur le VPS).

## v6.6 — 2026-10-09 — Raretés selon l'origine
- Cadeau du jour : 88 % commun, 11 % rare, 1 % super rare.
- Quêtes : surtout rare (70 %), 22 % commun, 8 % super rare.
- Épique : réservé au gagnant du mois (une fois par mois).

## v6.5 — 2026-10-09 — Quiz : plus d'emoji dans les réponses
- Les choix de réponse des quiz n'affichent plus l'emoji du mot (il donnait la réponse) ; l'emoji reste dans la question.

## v6.4 — 2026-10-09 — Inventaire, coupe Mao, retraits
- **Page « Mon inventaire »** (Profil et éditeur) : toute la collection par catégorie, compteurs, filtres par rareté, objets non gagnés grisés 🔒, clic pour porter un objet possédé.
- **Coupe Mao** rangée dans Cheveux → Coupes spéciales (remplace la coiffure de base).
- Cornes de diable remplacées par une **couronne de laurier** ; bouche « Malade » retirée.

## v6.3 — 2026-10-09 — Pleine page, atelier facile, nouveaux objets
- **Profil et éditeur du personnage en pleine page** ; grand avatar dans le profil.
- **Atelier admin** pleine page : aperçu agrandi, glisser pour déplacer, molette pour la taille, flèches du clavier pour affiner.
- **Combinaison d'astronaute** : le cou passe dans le col (une partie du col derrière le cou).
- **Nouveautés** : coupe Mao, costume col Mao, drapeau chinois (en main), petit livre rouge, badge du Parti.

## v6.2 — 2026-10-09 — Tenues alignées, podium corrigé
- **Tenues fantaisie** : toutes épousent exactement la silhouette du buste (épaules, côtés, col) ; plus de décalage ni de vêtement de base qui dépasse.
- **Podium** : médaille et numéro restent dans la marche (plus de débordement en bas).

## v6.1 — 2026-10-09 — Quêtes en objets, avatars animés dans le classement
- **Les quêtes du jour récompensent par un objet à collectionner** (même rareté que le cadeau du jour) au lieu de +20 XP ; +20 XP seulement si tout est déjà débloqué.
- **Classement** : avatars animés (aura, ailes, objet en main) dans un cadre complet de 58 px qui ne déborde plus ; les très petites icônes (en-tête, barre du bas) restent sans effets.

## v6.0 — 2026-10-09 — Refonte de la personnalisation du personnage
Le personnage est maintenant construit par **emplacements** et une **pile de couches unique** : plus d'objets qui passent « au-dessus » ou « en dessous » sans logique.
- **Éditeur par emplacements** : Moi · Cheveux · Visage · Barbe (garçons) · Lunettes · Tête · Tenue · Main · Dos · Aura. Chaque emplacement montre des **vignettes recadrées sur la zone concernée** (on voit enfin ce que fait chaque choix), avec des **noms lisibles en français et en chinois** (plus de « #12 »).
- **Parcours guidé** : « ? » au départ → origine → sexe → les autres emplacements s'ouvrent.
- **Ordre d'empilement défini une fois pour toutes** : aura et ailes/cape derrière le corps ; tenue fantaisie et barbe de 2 jours **sous** le visage, la barbe et les cheveux (les cheveux longs recouvrent les épaules, la barbe passe devant le vêtement) ; lunettes ; chapeau ou accessoire de cheveux ; objet tenu en main ; effets devant.
- **Exclusivités explicites** : une seule chose sur la tête (chapeau **ou** accessoire de cheveux), une seule paire de lunettes (de base **ou** fantaisie), une seule chose dans le dos (ailes **ou** cape), une tenue (de base **ou** fantaisie). Choisir l'un retire l'autre avec un message ; rien n'est caché en silence.
- **Contenu** : 10 lunettes fantaisie, 11 accessoires de cheveux, 7 tenues fantaisie, 2 capes (derrière le corps, avec fermoir), barbe de 2 jours, lunettes de base libres et lunettes spéciales à débloquer, tenues habillées à débloquer. **83 objets** à collectionner avec le cadeau du jour (commun, rare, super rare, épique).
- **Même cadrage pour tous les avatars** (rien n'est coupé, même échelle partout) ; petites icônes (en-tête, barre du bas, classement) recadrées sur le buste.
- **Collection** : filtre « Masquer ce que je n'ai pas encore », compteurs par section ; ce que l'élève porte déjà lui est acquis.
- **Atelier admin** adapté (capes, lunettes, accessoires de cheveux, tenues) ; lunettes recalées sur les yeux.
- **Écrans bas** (téléphone en paysage) : mise en page à deux colonnes. Clavier : Entrée/Espace sur les vignettes. Un glissement du sélecteur de couleur = une seule étape « Annuler ».

## v5.1 — 2026-10-08 — Atelier admin et accessoires animés
- Positions des accessoires **réglables par l'administrateur** (atelier : aperçu agrandi, curseurs, modifications en masse, copie garçons → filles) et **enregistrées pour tous** côté serveur (`?accpos=1`).
- Podium du classement avec avatars, avatar dans la barre du bas, chapeaux redessinés, objets tenus en main (nourriture « mangée »), ailes et auras animées, effet brillant pour les objets rares, cadeau du jour avec raretés.

## v5.0 — 2026-10-08 — « Je parle baguette » et nouveaux visages
- Le site s'appelle **Je parle baguette · 我说法棍**.
- Visages **DiceBear (Avataaars)** à la place du dessin maison ; origine et sexe d'abord ; barres de progression plus visibles ; quêtes et barre du bas au style RPG.

## v4.0 — 2026-10-08 — Mobile et gamification
- Barre de navigation en bas, bouton retour, quêtes du jour, étoiles, vibrations ; classement motivant (podium, coach) ; profil très personnalisable ; premier éditeur de visages ; liaison orale de « Comment allez-vous ? ».

## v3.0 — 2026-10-08 — Progression fiable
- **Quiz de fin de chapitre corrigés par le serveur** (seuls ils comptent pour la progression et le classement), classement mensuel avec surprise du mois, chronomètre de classe avec pause des vacances, comptes à progression unique, administration par chapitre.

## v2.0 — 2026-10-08 — Comptes, classement, classes
- Comptes avec synchronisation, classement partagé, classes (Classe 2026), menu Français / 中文, chapitres dans l'ordre du cours, chronomètre du parcours, rôles administrateur gérés par le serveur.

## v1.0 — 2026-10-08 — Première version
- Vocabulaire A1 pour sinophones avec emojis, voix neuronale Microsoft, affiches du cours, quiz et répétition espacée.
