// ==================== MANGADEX PROXIED ENGINE ====================

const mangaSearchInput = document.getElementById('mangaSearchInput');
const mangaSearchBtn = document.getElementById('mangaSearchBtn');
const mangaGrid = document.getElementById('mangaGrid');
const mangaLoader = document.getElementById('mangaLoader');

// 1. Initial Load (Trending Manga)
document.addEventListener('DOMContentLoaded', () => {
    fetchManga('Solo Leveling'); 
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

// 3. Core Fetch Function with Proxy Hack
async function fetchManga(query) {
    mangaGrid.innerHTML = '';
    mangaLoader.style.display = 'block';

    // MangaDex API Search URL
    const apiUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art&contentRating[]=safe`;
    
    // Proxy to bypass CORS error (The Magic Ingredient)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy failed");
        
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents); 
        
        mangaLoader.style.display = 'none';

        if (!data.data || data.data.length === 0) {
            mangaGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a1a1aa;">No Manga found. Try "Naruto" or "One Piece".</p>`;
            return;
        }

        renderManga(data.data);
    } catch (error) {
        console.error("MangaDex Error:", error);
        mangaLoader.style.display = 'none';
        mangaGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #e11d48; padding: 2rem;">
            <h3>🏮 Connection to Manga Realm Failed</h3>
            <p style="color: #a1a1aa; font-size: 0.9rem; margin-top: 10px;">The API might be down or blocked. Try refreshing after 1 minute.</p>
        </div>`;
    }
}

// 4. Render Manga Cards
function renderManga(mangaList) {
    mangaGrid.innerHTML = '';

    mangaList.forEach(manga => {
        const id = manga.id;
        const attributes = manga.attributes;
        const title = attributes.title.en || attributes.title.ja || Object.values(attributes.title)[0] || "Unknown Title";
        
        // Find Cover Art filename from relationships
        const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverRel && coverRel.attributes ? coverRel.attributes.fileName : null;
        
        const coverUrl = coverFileName 
            ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
            : "https://via.placeholder.com/200x300?text=No+Cover";

        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <div class="manga-cover-wrapper">
                <img src="${coverUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Cover+Not+Found'">
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

// 5. Open Reader Page
function openMangaReader(mangaId, title) {
    window.location.href = `reader.html?id=${mangaId}&title=${title}`;
}
