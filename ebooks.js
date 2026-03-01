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

closeReaderBtn.addEventListener('click', () => {
    readerOverlay.classList.remove('active');
    readerContent.innerHTML = ''; // Memory clear karne ke liye
    document.body.style.overflow = ''; 
});

// ==================== INSTANT DIRECT DOWNLOAD ====================
downloadBtn.addEventListener('click', () => {
    if(currentDownloadUrl) {
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `⏳ Starting Download...`;
        
        // Native Browser Download Trigger (Instant & Direct)
        const a = document.createElement('a');
        a.href = currentDownloadUrl;
        a.target = '_blank'; // Opens directly without waiting
        a.download = `${currentBookTitle}_EduHub`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => { downloadBtn.innerHTML = originalText; }, 2000);
    } else {
        alert("Sorry, direct download file is not available for this book.");
    }
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
        const epubLink = book.formats['application/epub+zip'];
        const htmlLink = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
        
        // Read link logic: Prefer PDF, then HTML
        const readLink = pdfLink || htmlLink;
        // Download logic: Prefer EPUB/PDF
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
                openPremiumReader(title, readLink, downloadLink, isPdf);
            } else {
                alert("Sorry, reading format is not available.");
            }
        });

        ebooksGrid.appendChild(card);
    });
}

// ==================== SMART EXTERNAL & PREMIUM READER ====================
async function openPremiumReader(title, readUrl, dlUrl, isPdf) {
    currentBookTitle = title;
    currentDownloadUrl = dlUrl;
    readerTitle.innerText = title;
    
    readerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; 
    
    // Centered Loading State
    readerContent.innerHTML = `<div class="loading-state" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <div class="spinner"></div>
        <p style="margin-top:15px; color:#a0a0a0;">Loading Premium Reader...</p>
    </div>`;

    try {
        if (isPdf) {
            // ==================== EXTERNAL PDF READER ====================
            const externalPdfViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(readUrl)}&embedded=true`;
            readerContent.innerHTML = `<iframe src="${externalPdfViewer}" style="width:100%; height:100%; border:none; background-color:#09090b;"></iframe>`;
        } else {
            // ==================== DARK MODE HTML READER ====================
            // Using RAW proxy instead of JSON wrapper to prevent parsing errors on large books
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(readUrl)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) throw new Error("Proxy fetch failed");
            
            let bookHtml = await response.text();
            
            if (!bookHtml) throw new Error("Empty content received");

            const baseUrl = readUrl.substring(0, readUrl.lastIndexOf('/') + 1);

            // Our Custom Dark Theme Injection
            const premiumStyling = `
                <base href="${baseUrl}">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap');
                    
                    body {
                        background-color: #09090b !important;
                        color: #e4e4e7 !important;
                        font-family: 'Playfair Display', Georgia, serif !important;
                        line-height: 1.8 !important;
                        padding: 3rem 8% !important;
                        max-width: 800px !important;
                        margin: 0 auto !important;
                        font-size: 1.15rem !important;
                    }
                    
                    h1, h2, h3, h4, h5 { color: #ffffff !important; font-family: 'Inter', sans-serif !important; text-align: center !important; margin-top: 3rem !important; font-weight: 600 !important; }
                    p { margin-bottom: 1.5rem !important; text-align: justify !important; }
                    a { color: #c9a050 !important; text-decoration: none !important; }
                    img { max-width: 100% !important; height: auto !important; border-radius: 8px !important; display: block; margin: 2rem auto !important; }
                    pre { background: #18181b !important; padding: 1rem !important; border-radius: 8px !important; font-family: monospace !important; font-size: 0.9rem !important; white-space: pre-wrap !important; overflow-x: auto !important;}
                </style>
            `;

            if (bookHtml.includes('</head>')) {
                bookHtml = bookHtml.replace('</head>', premiumStyling + '</head>');
            } else {
                bookHtml = premiumStyling + bookHtml; 
            }

            // Inject iframe
            readerContent.innerHTML = `<iframe id="premiumFrame" style="width:100%; height:100%; border:none; background-color:#09090b;"></iframe>`;
            
            // Timeout allows the DOM to render the iframe before writing inside it
            setTimeout(() => {
                const frame = document.getElementById('premiumFrame');
                if (frame) {
                    const frameDoc = frame.contentWindow.document;
                    frameDoc.open();
                    frameDoc.write(bookHtml);
                    frameDoc.close();
                }
            }, 100);
        }
    } catch (error) {
        console.error("Reader Error:", error);
        // Error screen with a working fallback link
        readerContent.innerHTML = `<div style="text-align:center; padding:3rem; color:#ef4444; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
            <h3 style="margin-bottom:10px;">⚠️ Could not load the dark reader</h3>
            <p style="color:#a1a1aa; max-width: 400px; line-height:1.5;">The book file is either too large or the server blocked our custom dark mode request.</p>
            <a href="${readUrl}" target="_blank" style="margin-top:25px; display:inline-block; background:#ffffff; color:#000000; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; transition: 0.2s;">📖 Read Original Version</a>
        </div>`;
    }
}

// ==================== UTILS ====================
function removeChipSelection() {
    categoryChips.forEach(c => c.classList.remove('active'));
}
