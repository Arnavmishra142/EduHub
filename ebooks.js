// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('ebookSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryChips = document.querySelectorAll('.chip');
const ebooksGrid = document.getElementById('ebooksGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Page load hote hi ek fast topic query chalate hain
    fetchBooks('fiction', 'topic'); 
});

// ==================== EVENT LISTENERS ====================
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) { removeChipSelection(); fetchBooks(query, 'search'); }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) { removeChipSelection(); fetchBooks(query, 'search'); }
    }
});

categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
        removeChipSelection();
        chip.classList.add('active');
        searchInput.value = '';
        fetchBooks(chip.getAttribute('data-topic'), 'topic');
    });
});

// ==================== CORE API ENGINE (GUTENDEX) ====================
async function fetchBooks(query, type) {
    ebooksGrid.innerHTML = '';
    loadingIndicator.style.display = 'block';

    let apiUrl = type === 'search' 
        ? `https://gutendex.com/books/?search=${encodeURIComponent(query)}` 
        : `https://gutendex.com/books/?topic=${encodeURIComponent(query)}`;

    try {
        console.log("🚀 Fetching Data From:", apiUrl); // F12 console me check karne ke liye
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} (Shayad Rate Limit lag gayi hai)`);
        }
        
        const data = await response.json();
        console.log("📦 API Response Received:", data); 
        
        loadingIndicator.style.display = 'none';

        if (!data.results || data.results.length === 0) {
            ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a1a1aa; padding: 3rem;">No books found for "${query}". Try another keyword.</div>`;
            return;
        }

        renderBooks(data.results);

    } catch (error) {
        console.error("❌ Fetch Books Error:", error);
        loadingIndicator.style.display = 'none';
        ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 3rem;">
            <h3>⚠️ Failed to fetch books.</h3>
            <p style="color:#a1a1aa; font-size: 0.9rem; margin-top: 10px;">Please check your internet or try again in 1 minute. (API Rate Limit)</p>
        </div>`;
    }
}

// ==================== RENDER BOOKS TO UI ====================
function renderBooks(books) {
    ebooksGrid.innerHTML = ''; 

    // Ab hum bina photo wali books ko filter nahi karenge!
    books.slice(0, 20).forEach(book => { 
        const title = book.title || "Unknown Title";
        const author = book.authors && book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
        
        // 🌟 MAGIC: Agar cover photo nahi mili API se, toh ek dark premium placeholder dikhayega
        const coverImg = book.formats['image/jpeg'] || "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80";
        
        // Smart Format Selection
        const pdfLink = book.formats['application/pdf'];
        const htmlLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
        const epubLink = book.formats['application/epub+zip'];
        
        // Read link logic: Prefer PDF -> then HTML -> then EPUB
        const readLink = pdfLink || htmlLink || epubLink;

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${coverImg}" alt="${title}" class="book-cover" loading="lazy">
            <div class="book-info">
                <h3 title="${title}">${title}</h3>
                <p>${author}</p>
                <button class="read-btn">📖 Read Book</button>
            </div>
        `;

        card.querySelector('.read-btn').addEventListener('click', () => {
            if (readLink) {
                const isPdf = !!pdfLink;
                redirectToMasterReader(title, readLink, isPdf);
            } else {
                alert("Sorry, reading format is not available for this specific book.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== REDIRECT TO MASTER READER ====================
function redirectToMasterReader(title, readUrl, isPdf) {
    const safeTitle = encodeURIComponent(title);
    const safeUrl = encodeURIComponent(readUrl);
    const type = isPdf ? 'pdf' : 'html'; 
    window.location.href = `reader.html?type=${type}&title=${safeTitle}&url=${safeUrl}`;
}

// ==================== UTILS ====================
function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}
