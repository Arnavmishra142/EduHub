// ==================== ULTIMATE MANGADEX ENGINE ====================

const mangaSearchInput = document.getElementById('mangaSearchInput');
const mangaSearchBtn = document.getElementById('mangaSearchBtn');
const mangaGrid = document.getElementById('mangaGrid');
const mangaLoader = document.getElementById('mangaLoader');

// 1. Initial Load
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

// 3. Robust Fetch Function (Bypasses Indian ISP Blocks)
async function fetchManga(query) {
    mangaGrid.innerHTML = '';
    mangaLoader.style.display = 'block';

    // Original API URL
    const apiUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art&contentRating[]=safe`;
    
    // 🔥 Advanced Proxy to bypass Cloudflare & ISP Blocks
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

    try {
        // 15 Seconds strict timeout so the spinner doesn't load infinitely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        mangaLoader.style.display = 'none';

        if (!data.data || data.data.length === 0) {
            mangaGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a1a1aa;">No Manga found. Try "Naruto" or "Jujutsu Kaisen".</p>`;
            return;
        }

        renderManga(data.data);
    } catch (error) {
        console.error("Manga Fetch Error:", error);
        mangaLoader.style.display = 'none';
        mangaGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #e11d48; padding: 2rem;">
            <h3>🏮 Network Blocked or Slow</h3>
            <p style="color: #a1a1aa; font-size: 0.9rem; margin-top: 10px;">Your ISP might be blocking the anime servers, or the connection timed out. Try again or use a VPN.</p>
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
        
        // Find Cover Art filename
        const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverRel && coverRel.attributes ? coverRel.attributes.fileName : null;
        
        // Original Image URL
        const mdImageUrl = coverFileName 
            ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
            : null;

        // 🔥 Image Proxy (wsrv.nl) - Taaki photos load hone mein dikkat na aaye!
        const coverUrl = mdImageUrl 
            ? `https://wsrv.nl/?url=${encodeURIComponent(mdImageUrl)}`
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
                <h3 title="${title}">${title}</h3>
            </div>
        `;
        mangaGrid.appendChild(card);
    });
}

// 5. Open Reader Page
function openMangaReader(mangaId, title) {
    window.location.href = `reader.html?id=${mangaId}&title=${title}`;
}
