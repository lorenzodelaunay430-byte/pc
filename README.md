# Site de stock des boîtes - GitHub Pages

## Fonctionnement
- `index.html` : page principale avec recherche, stats et liste des boîtes.
- `box.html?id=BX-001` : affiche directement la boîte scannée.
- `stock.json` : contient toutes les boîtes et leurs emplacements.

## Idée pour le scan code-barres
Chaque code-barres doit contenir l'URL complète vers la boîte :

`https://TON-PSEUDO.github.io/NOM-DU-DEPOT/box.html?id=BX-001`

Quand le lecteur scanne le code, il ouvre directement la bonne fiche.

## Mise en ligne sur GitHub Pages
1. Créer un dépôt GitHub.
2. Envoyer tous les fichiers dedans.
3. Aller dans `Settings` > `Pages`.
4. Choisir la branche `main` et le dossier `/root`.
5. Valider.

## Modifier le stock
Éditer simplement `stock.json` :
- `id` = identifiant de la boîte
- `name` = nom court
- `content` = contenu
- `location` = emplacement
- `quantity` = quantité restante

## Limite importante
Avec GitHub Pages seul, le site est **en lecture**.
Pour mettre à jour automatiquement les quantités après scan, il faudra ajouter un backend type **Supabase** ou **Firebase**.
