// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('ebookSearch');
const searchBtn = document.getElementById('searchBtn');
const categoryChips = document.querySelectorAll('.chip');
const ebooksGrid = document.getElementById('ebooksGrid');
const loadingIndicator = document.getElementById('loadingIndicator');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Page load default category
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
        if (!response.ok) throw new Error("API Limit");
        
        const data = await response.json();
        loadingIndicator.style.display = 'none';

        if (!data.results || data.results.length === 0) {
            ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #a1a1aa; padding: 3rem;">No books found. Try another keyword.</div>`;
            return;
        }

        renderBooks(data.results);
    } catch (error) {
        loadingIndicator.style.display = 'none';
        ebooksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 3rem;">⚠️ Failed to fetch books. Project Gutenberg API might be rate-limiting you. Please wait 1 minute.</div>`;
    }
}

// ==================== RENDER BOOKS ====================
function renderBooks(books) {
    ebooksGrid.innerHTML = ''; 

    books.slice(0, 24).forEach(book => { 
        const title = book.title || "Unknown Title";
        const author = book.authors && book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
        const coverImg = book.formats['image/jpeg'] || "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80";
        
        // Exact Links Extract
        const pdfLink = book.formats['application/pdf'];
        const htmlLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
        const epubLink = book.formats['application/epub+zip'];
        const textLink = book.formats['text/plain; charset=utf-8'] || book.formats['text/plain; charset=us-ascii'];
        
        // Final Decide - Kya padhna hai aur kya download karna hai
        const readLink = pdfLink || htmlLink || textLink;
        const downloadLink = epubLink || pdfLink || htmlLink; 

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
                redirectToMasterReader(title, readLink, downloadLink, isPdf);
            } else {
                alert("Sorry, reading format is not available.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== REDIRECT TO MASTER READER ====================
function redirectToMasterReader(title, readUrl, dlUrl, isPdf) {
    const safeTitle = encodeURIComponent(title);
    const safeUrl = encodeURIComponent(readUrl);
    const safeDl = dlUrl ? encodeURIComponent(dlUrl) : ''; 
    const type = isPdf ? 'pdf' : 'html'; 
    
    // Yahan hum url me clear variables bhej rahe hain
    window.location.href = `reader.html?type=${type}&title=${safeTitle}&url=${safeUrl}&dl=${safeDl}`;
}

function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}
// ==================== WHATSAPP REQUEST FEATURE ====================
document.addEventListener('DOMContentLoaded', () => {
    const requestModal = document.getElementById('requestModal');
    const openReqBtn = document.getElementById('openRequestBtn');
    const closeReqBtn = document.getElementById('closeRequestBtn');
    const sendReqBtn = document.getElementById('sendRequestBtn');
    const reqName = document.getElementById('reqName');
    const reqBook = document.getElementById('reqBook');

    // Tera WhatsApp Number (with country code 91)
    const adminWhatsAppNumber = "916393349498"; 

    // Open & Close Modal
    openReqBtn.addEventListener('click', () => requestModal.classList.add('active'));
    closeReqBtn.addEventListener('click', () => requestModal.classList.remove('active'));

    // Send Request Logic
    sendReqBtn.addEventListener('click', () => {
        const name = reqName.value.trim();
        const book = reqBook.value.trim();
        
        if (!name || !book) {
            alert("Please enter both your Name and the Book Name! 😅");
            return;
        }
        
        // 48 Hours alert
        alert(`Awesome ${name}! 🎉\nYour request is being sent. We will add the book within 48 Hours!`);
        
        // WhatsApp Message Format
        const message = `Hello EduHub! 👋\n\nMera naam *${name}* hai.\nMujhe library me ye book chahiye thi:\n\n📚 *${book}*\n\nPlease isko 48 hours me add kar dijiye!`;
        
        // WhatsApp API URL builder
        const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        
        // Clear Inputs & Close Modal
        reqName.value = '';
        reqBook.value = '';
        requestModal.classList.remove('active');
        
        // Open WhatsApp in new tab/app
        window.open(waUrl, '_blank');
    });
});
