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
