// ==================== MANGADEX ENGINE ====================

const mangaSearchInput = document.getElementById('mangaSearchInput');
const mangaSearchBtn = document.getElementById('mangaSearchBtn');
const mangaGrid = document.getElementById('mangaGrid');
const mangaLoader = document.getElementById('mangaLoader');

// 1. Initial Load (Trending Manga)
document.addEventListener('DOMContentLoaded', () => {
    fetchManga('Solo Leveling'); // Default search
});

// 2. Search Event Listeners
mangaSearchBtn.addEventListener('click', () => {
    const query = mangaSearchInput.value.trim();
    if (query) fetchManga(query);
});

mangaSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = mangaSearchInput.value.trim();
        if (query) fetchManga(query);
    }
});

// 3. Core Fetch Function
async function fetchManga(query) {
    mangaGrid.innerHTML = '';
    mangaLoader.style.display = 'block';

    try {
        // MangaDex API Search URL
        const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art`);
        const data = await response.json();
        
        mangaLoader.style.display = 'none';

        if (data.data.length === 0) {
            mangaGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a1a1aa;">No Manga found. Try another title!</p>`;
            return;
        }

        renderManga(data.data);
    } catch (error) {
        console.error("MangaDex Error:", error);
        mangaLoader.style.display = 'none';
        mangaGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #e11d48;">⚠️ Error connecting to MangaDex. Try again.</p>`;
    }
}

// 4. Render Manga Cards
function renderManga(mangaList) {
    mangaGrid.innerHTML = '';

    mangaList.forEach(manga => {
        const id = manga.id;
        const title = manga.attributes.title.en || manga.attributes.title.ja || "Unknown Title";
        
        // Find Cover Art filename from relationships
        const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverRel ? coverRel.attributes.fileName : "";
        const coverUrl = coverFileName 
            ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
            : "https://via.placeholder.com/200x300?text=No+Cover";

        const card = document.createElement('div');
        card.className = 'manga-card';
        // Add CSS for manga-card in your manga.css if missing
        card.innerHTML = `
            <div class="manga-cover-wrapper">
                <img src="${coverUrl}" alt="${title}" loading="lazy">
                <div class="manga-overlay">
                    <button onclick="openMangaReader('${id}', '${encodeURIComponent(title)}')">Read Now</button>
                </div>
            </div>
            <div class="manga-info">
                <h3>${title}</h3>
            </div>
        `;
        mangaGrid.appendChild(card);
    });
}

// 5. Redirect to Reader (Will build next)
function openMangaReader(mangaId, title) {
    // Ye user ko hamare naye manga-reader page pe bhejega
    window.location.href = `reader.html?id=${mangaId}&title=${title}`;
}
