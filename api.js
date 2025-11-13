document.addEventListener('DOMContentLoaded', () => {
    
    
    const OMDB_API_KEY = "aa148fdd"; 
    const TASTEDIVE_API_KEY = "1062321-StudentH-107BA24D"; 

    
    const API_CONTAINER = document.getElementById('peliculas-api-container');
    const API_LOADING = document.getElementById('api-loading');

    
    const movieTitles = [
        "Avatar: The Way of Water", 
        "Dune: Part Two", 
        "Oppenheimer", 
        "Barbie"
    ];

    
    function createMovieCard(movie) {
        const card = document.createElement('article');
        card.classList.add('api-card');
        
        
        const posterPath = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : 'imagenes/placeholder.jpg'; 
        const plot = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot.substring(0, 100) : 'Sin descripción disponible';
        const releaseDate = movie.Released && movie.Released !== 'N/A' ? movie.Released : 'Fecha Desconocida';
        
        card.innerHTML = `
            <h3>${movie.Title}</h3>
            <img src="${posterPath}" alt="Poster de ${movie.Title}">
            <p><strong>Fecha de Estreno:</strong> ${releaseDate}</p>
            <p>${plot}...</p>
        `;
        return card;
    }

    
    async function fetchMoviesFromAPI() {
        
        if (API_LOADING) {
            API_LOADING.style.display = 'block'; 
        }
        
        if (API_CONTAINER) {
            API_CONTAINER.innerHTML = ''; 
        }

        
        const fetchPromises = movieTitles.map(title => {
            const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=short`;
            
            return fetch(url).then(response => response.json());
        });

        try {
            
            const results = await Promise.all(fetchPromises);
            
            
            results.forEach(data => {
                
                if (data.Response === "True") {
                    API_CONTAINER.appendChild(createMovieCard(data));
                }
            });

            
            if (API_CONTAINER.innerHTML === '') {
                 API_CONTAINER.innerHTML = '<p style="text-align: center;">No se pudieron cargar películas. Verifica que los títulos de búsqueda sean correctos o tu clave de API.</p>';
            }

        } catch (error) {
            console.error("Fallo al obtener datos de la API de OMDb:", error);
            if (API_CONTAINER) {
                API_CONTAINER.innerHTML = `<p style="text-align: center; color: red;">Error al cargar películas: ${error.message}. Asegúrate de que tu API Key es correcta.</p>`;
            }
        } finally {
            if (API_LOADING) {
                API_LOADING.style.display = 'none'; 
            }
        }
    }
    
    
    async function fetchTasteDive(query) {
        const url = `https://tastedive.com/api/similar?q=${encodeURIComponent(query)}&k=${TASTEDIVE_API_KEY}&info=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Recomendaciones de TasteDive:", data);
        } catch (error) {
            console.error("Fallo al obtener recomendaciones de TasteDive:", error);
        }
    }

    
    fetchMoviesFromAPI();

    
});