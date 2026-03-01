// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('ebookSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryChips = document.querySelectorAll('.chip');
const ebooksGrid = document.getElementById('ebooksGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Page load hote hi kuch badhiya books suggest hongi
    fetchBooks('success', 'search'); 
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
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network issue");
        const data = await response.json();
        
        loadingIndicator.style.display = 'none';

        if (data.results.length === 0) {
            ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a1a1aa; padding: 3rem;">No books found. Try another keyword.</div>`;
            return;
        }

        renderBooks(data.results);

    } catch (error) {
        loadingIndicator.style.display = 'none';
        ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 3rem;">⚠️ Failed to fetch books. Check your internet.</div>`;
    }
}

// ==================== RENDER BOOKS TO UI ====================
function renderBooks(books) {
    ebooksGrid.innerHTML = ''; 

    // Sirf images wali books
    const validBooks = books.filter(book => book.formats['image/jpeg']);

    validBooks.slice(0, 20).forEach(book => { 
        const title = book.title;
        const author = book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
        const coverImg = book.formats['image/jpeg'];
        
        // Smart Format Selection
        const pdfLink = book.formats['application/pdf'];
        const htmlLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
        
        // Read link logic: Prefer PDF, then HTML
        const readLink = pdfLink || htmlLink;

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
                // Seedha naye Master Reader function ko call karenge
                redirectToMasterReader(title, readLink, isPdf);
            } else {
                alert("Sorry, reading format is not available.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== REDIRECT TO MASTER READER ====================
function redirectToMasterReader(title, readUrl, isPdf) {
    // Data ko safe banate hain taaki link na toote
    const safeTitle = encodeURIComponent(title);
    const safeUrl = encodeURIComponent(readUrl);
    
    // Decide karte hain ki Master Reader ko PDF mode mein kholna hai ya HTML(book) mode mein
    const type = isPdf ? 'pdf' : 'html'; 
    
    // Seedha apne naye 'reader.html' par bhej dete hain URL parameters ke sath
    window.location.href = `reader.html?type=${type}&title=${safeTitle}&url=${safeUrl}`;
}

// ==================== UTILS ====================
function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}
