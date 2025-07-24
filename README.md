# VibeFlix 🎬

VibeFlix est une application web qui permet de rechercher, découvrir et visualiser les informations sur les films grâce à l’API TMDb.  
L’interface propose une recherche dynamique, l’affichage des films populaires, la visualisation des notes, affiches, et la lecture des bandes-annonces YouTube.

---

## Fonctionnalités

- Recherche de films par titre (API TMDb)
- Affichage des films populaires au chargement
- Affichage du titre, de l’affiche, de la note (étoiles et score)
- Lecture de la bande-annonce YouTube dans une popup

---

## Installation

1. **Clone le dépôt ou copie les fichiers dans un dossier local.**
2. **Obtiens une clé API TMDb**  
   - Crée un compte sur [themoviedb.org](https://www.themoviedb.org/)
   - Va dans les paramètres de ton compte > API > Génère une clé API v3
3. **Remplace la clé dans `movieApp.js`**  
   ```js
   const TMDB_API_KEY = 'VOTRE_CLÉ_API_ICI';
   ```
4. **Ouvre `movieApp.html` dans ton navigateur.**

---

## Structure des fichiers

- `movieApp.html` : Structure HTML de l’application
- `movieApp.css` : Styles et animations 
- `movieApp.js` : Logique JavaScript (API, affichage, interactions)
- `README.md` : Ce fichier d’aide

---


## Dépendances

Aucune dépendance externe.  
Tout fonctionne en HTML/CSS/JS natif.

---

## Crédits

- Données et images : [TMDb API](https://www.themoviedb.org/documentation/api)
- Icônes : SVG ou Unicode

---

## Licence

Projet éducatif, libre d’utilisation.

