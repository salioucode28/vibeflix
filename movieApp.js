// Constantes API
const TMDB_API_KEY = 'fd06120cbae486a0b6ac8d55fa86862b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Sélecteurs DOM
const searchInput = document.getElementById('movie-search-input');
const searchButton = document.getElementById('search-button');
const moviesGrid = document.getElementById('movies-grid');

// Convertir note sur 10 en étoiles sur 5
function getStars(vote) {
  const stars = Math.round(vote) / 2;
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// Créer une carte film avec bouton Play qui lance la bande-annonce
function createMovieCard(movie) {
  const article = document.createElement('article');
  article.className = 'movie-card';

  // Affiche affiche + overlay play
  const posterDiv = document.createElement('div');
  posterDiv.className = 'movie-poster';
  const img = document.createElement('img');
  img.src = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450/222/fff?text=No+Image';
  img.alt = `Affiche du film ${movie.title}`;
  posterDiv.appendChild(img);

  // Bouton Play overlay
  const overlay = document.createElement('div');
  overlay.className = 'movie-overlay';
  const playBtn = document.createElement('button');
  playBtn.className = 'play-button';
  playBtn.setAttribute('aria-label', `Lire la bande-annonce de ${movie.title}`);
  playBtn.textContent = '▶';
  overlay.appendChild(playBtn);
  posterDiv.appendChild(overlay);

  // Au clic sur play, récupère et affiche la bande-annonce
  playBtn.addEventListener('click', async () => {
    const trailerUrl = await getTrailerUrl(movie.id);
    if (trailerUrl) {
      showTrailerPopup(trailerUrl);
    } else {
      alert("Aucune bande-annonce disponible 😢");
    }
  });

  // Infos titre + note
  const infoDiv = document.createElement('div');
  infoDiv.className = 'movie-info';

  const title = document.createElement('h3');
  title.className = 'movie-title';
  title.textContent = movie.title;

  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'movie-rating';

  const starsSpan = document.createElement('span');
  starsSpan.className = 'stars';
  starsSpan.textContent = getStars(movie.vote_average);

  const ratingNumber = document.createElement('span');
  ratingNumber.className = 'rating-number';
  ratingNumber.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  ratingDiv.append(starsSpan, ratingNumber);
  infoDiv.append(title, ratingDiv);
  article.append(posterDiv, infoDiv);

  return article;
}

// Affiche une liste de films dans la grille
function displayMovies(movies) {
  moviesGrid.innerHTML = '';
  if (!movies.length) {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; color: #aaa; text-align:center;">Aucun film trouvé.</p>';
    return;
  }
  movies.forEach(movie => moviesGrid.appendChild(createMovieCard(movie)));
}

// Recherche des films via API TMDb
async function searchMovies(query) {
  if (!query.trim()) return;
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data?.results || []);
  } catch {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; color: #ff0057; text-align:center;">Erreur lors de la recherche.</p>';
  }
}

// Affiche les films populaires au chargement
async function showPopularMovies() {
  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data?.results || []);
  } catch {
    moviesGrid.innerHTML = '<p style="grid-column: 1/-1; color: #ff0057; text-align:center;">Erreur lors du chargement des films populaires.</p>';
  }
}

// Récupère l'URL YouTube de la bande-annonce
async function getTrailerUrl(movieId) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : null;
  } catch (error) {
    console.error("Erreur récupération bande-annonce:", error);
    return null;
  }
}

// Affiche une popup au centre avec la bande-annonce et un bouton fermer
function showTrailerPopup(url) {
  // Création overlay
  const overlay = document.createElement('div');
  overlay.className = 'trailer-overlay';
  overlay.innerHTML = `
    <div class="trailer-content">
      <button class="close-button" aria-label="Fermer la bande-annonce">✖</button>
      <iframe src="${url}" frameborder="0" allowfullscreen allow="autoplay"></iframe>
    </div>
  `;

  // Styles directement injectés pour la popup (tu peux mettre dans CSS)
  Object.assign(overlay.style, {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 9999,
  });

  const content = overlay.querySelector('.trailer-content');
  Object.assign(content.style, {
    position: 'relative',
    width: '80%',
    maxWidth: '900px',
    aspectRatio: '16 / 9',
    backgroundColor: '#000',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  });

  const iframe = content.querySelector('iframe');
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
  });

  const closeBtn = content.querySelector('.close-button');
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  });

  // Fermer la popup au clic sur la croix ou sur l'overlay (hors iframe)
  closeBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

// Événements recherche
searchButton.addEventListener('click', () => searchMovies(searchInput.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchMovies(searchInput.value);
});

// Affiche films populaires au démarrage
showPopularMovies();


