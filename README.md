# 🥖 Je parle baguette · 我说法棍 — français A1 pour sinophones

Parcours A1 en 17 chapitres (≈ 760 mots, 25 phrases) : vocabulaire avec emojis, prononciation (API), voix neuronale Microsoft, affiches du cours, quiz, répétition espacée.
Menu au choix : Français, 中文 ou Français + 中文 (bouton 🌐).

## Progression fiable et classement
- **Le quiz de fin de chapitre fait foi.** Il est fabriqué, corrigé et enregistré par le **serveur** : le navigateur ne reçoit jamais la bonne réponse avant d'avoir répondu et n'envoie jamais de « score ». Il faut 80 % pour valider un chapitre ; le meilleur score de chaque chapitre est conservé.
- Garde-fous : réponse en moins d'1 s = fausse, durée de session limitée, 6 essais par chapitre et par 24 h.
- Les cases « Je connais » et les quiz d'entraînement servent à s'entraîner : ils ne comptent **ni pour la progression ni pour le classement**.
- **Classement** (tous les comptes, avec possibilité de s'en retirer) : onglet **Ce mois-ci** (points gagnés pendant le mois : progrès par rapport aux meilleurs scores d'avant le mois ; égalité → le premier arrivé) et onglet **Total**. Le 1er du mois gagne une petite surprise ; le vainqueur du mois précédent est affiché.
- **Chronomètre de classe** : date de fin du parcours définie par l'administrateur ; les **vacances sont en pause** (jours non comptés). Il ne concerne que les élèves d'une classe.

## Comptes
- Compte = nom + mot de passe (clé dérivée dans le navigateur par PBKDF2, mot de passe jamais envoyé). Classe choisie à la création (« Classe 2026 » ou « Élève individuel »), modifiable depuis le profil ; pseudo et emoji personnalisables.
- Progressions **uniques** : nom de compte unique, création refusée si le compte existe, la progression locale appartient à un seul compte et n'est jamais fusionnée avec un autre.
- Mot de passe oublié : un administrateur génère un **code de récupération** (usage unique, 3 jours) ; l'élève choisit un nouveau mot de passe et retrouve toute sa progression. L'administrateur ne voit jamais de mot de passe.

## Administration (🛡️ Admin)
Élèves (résultat du quiz de chaque chapitre, code de récupération, changement de classe, admins), Chapitres, **Mois** (gagnants), Classes (vacances en pause, date de fin).

## Personnage (avatar)
- Éditeur **par emplacements** (Moi, Cheveux, Visage, Barbe, Lunettes, Tête, Tenue, Main, Dos, Aura). Origine et sexe d'abord ; tout est libre sauf les **accessoires**, à débloquer avec le **cadeau du jour** (commun, rare, super rare, épique). Un administrateur a tout débloqué.
- **Empilement des couches** (du fond vers l'avant) : aura · ailes/cape · corps (DiceBear) · tenue fantaisie et barbe de 2 jours (insérées juste avant la bouche : sous le visage, la barbe et les cheveux) · lunettes fantaisie · chapeau **ou** accessoire de cheveux · objet en main · effets devant. Les exclusivités (une seule chose par emplacement) sont dans `avPut()` / `avResolve()`.
- Positions des accessoires : **Atelier admin** (réglage, modifications en masse), enregistrées pour tous par le serveur (`?accpos=1`). Nouveau chapeau : dessiner son bord inférieur vers y≈90 (repère 280) pour profiter du réglage par défaut.

## Versions
Historique détaillé dans [`CHANGELOG.md`](CHANGELOG.md). Chaque version est une étiquette Git (`v1.0` … ) et une Release GitHub ; rien n'est jamais réécrit (`git checkout v5.1` pour relire une ancienne version).

## Fichiers
- `index.html` : l'application ; `data-fr.js`, `data-fr2.js`, `data-fr3.js` : vocabulaire, chapitres, sous-catégories et aides ; `audio-fr/` : sons ; `img-fr/` : affiches.
- `gen-audio-fr.py` : génère les sons (edge-tts). `export-vocab.js` : génère `server/vocab-fr.json` (**à relancer et à déployer après toute modification du vocabulaire**, le serveur s'en sert pour corriger les quiz).
- `server/api.php` + `server/vocab-fr.json` : API (à déployer ensemble sur le serveur). Espace de noms `?app=fr` ; l'appli chinoise n'est pas affectée.

## Crédits
Visages : [DiceBear](https://www.dicebear.com) (MIT) avec le style Avataaars (Pablo Stanley, usage libre).
