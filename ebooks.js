// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('ebookSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryChips = document.querySelectorAll('.chip');
const ebooksGrid = document.getElementById('ebooksGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// Reader Elements
const readerOverlay = document.getElementById('readerOverlay');
const closeReaderBtn = document.getElementById('closeReader');
const readerTitle = document.getElementById('readerTitle');
const readerContent = document.getElementById('readerContent');
const downloadBtn = document.getElementById('downloadBtn');

let currentDownloadUrl = '';
let currentBookTitle = '';

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Page load hote hi kuch badhiya "Suggested" books layega
    fetchBooks('success', 'search'); // 'success' is a good keyword for self-help/growth classics
});

// ==================== EVENT LISTENERS ====================

// 1. Search Button Click
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        removeChipSelection();
        fetchBooks(query, 'search');
    }
});

// 2. Enter Key in Search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            removeChipSelection();
            fetchBooks(query, 'search');
        }
    }
});

// 3. Category Chips Click
categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
        // Toggle Active Class
        removeChipSelection();
        chip.classList.add('active');
        
        // Clear Search Box
        searchInput.value = '';
        
        const topic = chip.getAttribute('data-topic');
        fetchBooks(topic, 'topic');
    });
});

// 4. Reader Close Button
closeReaderBtn.addEventListener('click', () => {
    readerOverlay.classList.remove('active');
    readerContent.innerHTML = ''; // Clear iframe memory
    document.body.style.overflow = ''; 
});

// 5. Download PDF Button (Inside Reader)
downloadBtn.addEventListener('click', () => {
    if(currentDownloadUrl) {
        forceDownload(currentDownloadUrl, `${currentBookTitle}.epub`, downloadBtn);
    } else {
        alert("Sorry, direct download file is not available for this book.");
    }
});

// ==================== CORE API ENGINE (GUTENDEX) ====================
async function fetchBooks(query, type) {
    // Show Loader, Hide Grid
    ebooksGrid.innerHTML = '';
    loadingIndicator.style.display = 'block';

    let apiUrl = '';
    if (type === 'search') {
        apiUrl = `https://gutendex.com/books/?search=${encodeURIComponent(query)}`;
    } else if (type === 'topic') {
        apiUrl = `https://gutendex.com/books/?topic=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const books = data.results;

        loadingIndicator.style.display = 'none';

        if (books.length === 0) {
            ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a1a1aa; padding: 3rem;">No books found for "${query}". Try another keyword.</div>`;
            return;
        }

        renderBooks(books);

    } catch (error) {
        loadingIndicator.style.display = 'none';
        ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 3rem;">⚠️ Failed to fetch books. Please check your internet.</div>`;
        console.error("Error fetching books:", error);
    }
}

// ==================== RENDER BOOKS TO UI ====================
function renderBooks(books) {
    ebooksGrid.innerHTML = ''; // Clear previous

    // Sirf wo books dikhayenge jinki photo available hai
    const validBooks = books.filter(book => book.formats['image/jpeg']);

    validBooks.slice(0, 20).forEach(book => { // Max 20 books dikhayenge for speed
        const title = book.title;
        const author = book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
        const coverImg = book.formats['image/jpeg'];
        
        // Find Read & Download Links
        const readLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'] || book.formats['text/plain; charset=us-ascii'];
        const downloadLink = book.formats['application/epub+zip'] || book.formats['application/pdf'] || readLink;

        // Create Card Element
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

        // Add Click Event to "Read Book" Button
        const readBtn = card.querySelector('.read-btn');
        readBtn.addEventListener('click', () => {
            if (readLink) {
                openReader(title, readLink, downloadLink);
            } else {
                alert("Sorry, reading format is not available for this specific book.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== READER UI ====================
function openReader(title, readUrl, dlUrl) {
    currentBookTitle = title;
    currentDownloadUrl = dlUrl;

    readerTitle.innerText = title;
    
    // Inject iframe for reading
    readerContent.innerHTML = `
        <iframe src="${readUrl}" class="premium-pdf-viewer" title="${title}"></iframe>
    `;

    readerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
}

// ==================== UTILS ====================
function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}

// Direct Download Hack (CORS bypass fallback)
async function forceDownload(url, filename, btnElement) {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `⏳ Downloading...`;
    
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        btnElement.innerHTML = `✅ Downloaded!`;
    } catch (e) {
        console.log("CORS blocked Force Download, opening in new tab.", e);
        // Fallback: Opens in new tab
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        btnElement.innerHTML = originalText;
    }
    
    setTimeout(() => { btnElement.innerHTML = originalText; }, 3000);
}
