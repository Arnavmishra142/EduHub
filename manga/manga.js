// ==================== TITANIUM MANGADEX ENGINE ====================

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

// 3. Multi-Proxy Fetch Function (Bypasses Cloudflare & ISP)
async function fetchManga(query) {
    mangaGrid.innerHTML = '';
    mangaLoader.style.display = 'block';

    const cleanQuery = encodeURIComponent(query);
    const apiUrl = `https://api.mangadex.org/manga?title=${cleanQuery}&limit=16&includes[]=cover_art`;
    
    // 🔥 The Multi-Proxy Arsenal
    const fetchRoutes = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`, // Route 1: AllOrigins Direct
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`, // Route 2: CodeTabs Proxy
        apiUrl // Route 3: Direct API (Will work if user is on VPN)
    ];

    let mangaData = null;

    // Loop through routes until one succeeds
    for (let route of fetchRoutes) {
        try {
            console.log("🚀 Trying route:", route);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 sec limit per route

            const response = await fetch(route, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                mangaData = await response.json();
                console.log("✅ Success on route!");
                break; // Exit loop if successful
            }
        } catch (error) {
            console.warn("⚠️ Route failed, trying next...");
        }
    }

    mangaLoader.style.display = 'none';

    // If ALL routes failed
    if (!mangaData || !mangaData.data) {
        mangaGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #e11d48; padding: 2rem;">
            <h3>🏮 Servers are highly shielded right now</h3>
            <p style="color: #a1a1aa; font-size: 0.9rem; margin-top: 10px;">MangaDex's security is blocking our requests. Please try again in a few minutes or keep your VPN ON.</p>
        </div>`;
        return;
    }

    // If Search returns empty
    if (mangaData.data.length === 0) {
        mangaGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a1a1aa;">No Manga found for "${query}". Try another name.</p>`;
        return;
    }

    renderManga(mangaData.data);
}

// 4. Render Manga Cards
function renderManga(mangaList) {
    mangaGrid.innerHTML = '';

    mangaList.forEach(manga => {
        const id = manga.id;
        const attributes = manga.attributes;
        const title = attributes.title.en || attributes.title.ja || Object.values(attributes.title)[0] || "Unknown Title";
        
        // Extract Cover Image
        const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverRel && coverRel.attributes ? coverRel.attributes.fileName : null;
        
        const mdImageUrl = coverFileName 
            ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.256.jpg`
            : null;

        // Image Proxy to prevent broken images
        const coverUrl = mdImageUrl 
            ? `https://wsrv.nl/?url=${encodeURIComponent(mdImageUrl)}`
            : "https://via.placeholder.com/200x300/121214/e11d48?text=No+Cover";

        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <div class="manga-cover-wrapper">
                <img src="${coverUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300/121214/e11d48?text=Cover+Not+Found'">
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
