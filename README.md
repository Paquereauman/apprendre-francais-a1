# 🥖 Bonjour ! 学法语 · Apprendre le français A1 (pour sinophones)

Parcours A1 : vocabulaire avec emojis, prononciation (API), voix neuronale Microsoft, quiz variés, répétition espacée, plan et test de niveau.
Une seule page web, aucune dépendance.

## Compte, sauvegarde et classement
- Compte = nom + mot de passe (clé dérivée dans le navigateur, jamais envoyée en clair) ; la progression est synchronisée via l'API `server/api.php` (`?app=fr`).
- Menu au choix : Français, 中文 ou Français + 中文 (bouton 🌐).
- Le classement exige la version de `server/api.php` de ce dépôt (espace de noms `app=fr`) ; sans elle, la page Classement affiche « pas encore activé » et le reste fonctionne.
- Le cours A1 est chronométré du 15 janvier au 7 mars.

## Administration
- Les administrateurs sont gérés côté serveur (`admins.json`). Un administrateur peut nommer/retirer d'autres administrateurs et retirer quelqu'un du classement (bouton 🛡️ Admin).
- Premier administrateur : le compte « Baptiste » se connecte puis saisit le code de première activation (son hash est placé dans `admin_setup.sha256` sur le serveur ; le fichier est supprimé après usage).
