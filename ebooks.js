// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('ebookSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryChips = document.querySelectorAll('.chip');
const ebooksGrid = document.getElementById('ebooksGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
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

// ==================== CORE API ENGINE ====================
async function fetchBooks(query, type) {
    ebooksGrid.innerHTML = '';
    loadingIndicator.style.display = 'block';

    let apiUrl = type === 'search' 
        ? `https://gutendex.com/books/?search=${encodeURIComponent(query)}` 
        : `https://gutendex.com/books/?topic=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API Rate Limit Hit");
        const data = await response.json();
        
        loadingIndicator.style.display = 'none';

        if (!data.results || data.results.length === 0) {
            ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a1a1aa; padding: 3rem;">No books found. Try another keyword.</div>`;
            return;
        }

        renderBooks(data.results);
    } catch (error) {
        loadingIndicator.style.display = 'none';
        ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 3rem;">⚠️ Failed to fetch books. Check your internet or wait 1 minute.</div>`;
    }
}

// ==================== RENDER BOOKS ====================
function renderBooks(books) {
    ebooksGrid.innerHTML = ''; 

    books.slice(0, 20).forEach(book => { 
        const title = book.title || "Unknown Title";
        const author = book.authors && book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
        const coverImg = book.formats['image/jpeg'] || "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80";
        
        // Formats Extract
        const pdfLink = book.formats['application/pdf'];
        const htmlLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
        const epubLink = book.formats['application/epub+zip'];
        
        // Logic: Kya padhna hai aur kya download karna hai
        const readLink = pdfLink || htmlLink || epubLink;
        const downloadLink = epubLink || pdfLink || htmlLink; // Best format for download

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
                // Naya Function: Ab hum dlUrl (Download link) bhi bhej rahe hain!
                redirectToMasterReader(title, readLink, downloadLink, isPdf);
            } else {
                alert("Sorry, reading format is not available.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== REDIRECT ====================
function redirectToMasterReader(title, readUrl, dlUrl, isPdf) {
    const safeTitle = encodeURIComponent(title);
    const safeUrl = encodeURIComponent(readUrl);
    const safeDl = encodeURIComponent(dlUrl); // Safe Download Link
    const type = isPdf ? 'pdf' : 'html'; 
    
    // URL me dl (download) parameter add kiya hai
    window.location.href = `reader.html?type=${type}&title=${safeTitle}&url=${safeUrl}&dl=${safeDl}`;
}

function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}
