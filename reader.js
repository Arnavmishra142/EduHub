// ==================== MASTER READER ENGINE ====================

// 1. Get Variables from URL (Safe Decoding)
const urlParams = new URLSearchParams(window.location.search);
const fileUrl = urlParams.get('url') ? decodeURIComponent(urlParams.get('url')) : '';
const dlUrl = urlParams.get('dl') ? decodeURIComponent(urlParams.get('dl')) : ''; 
const fileType = urlParams.get('type') || 'pdf'; 
const bookTitle = urlParams.get('title') ? decodeURIComponent(urlParams.get('title')) : 'EduHub Reader';

// 2. DOM Elements
const rTitle = document.getElementById('rTitle');
const rLoader = document.getElementById('rLoader');
const loaderText = document.getElementById('loaderText');
const pdfWrapper = document.getElementById('pdfWrapper');
const mangaWrapper = document.getElementById('mangaWrapper');
const readerContainer = document.getElementById('readerContainer');
const readerTopbar = document.getElementById('readerTopbar');
const backBtn = document.getElementById('backBtn');
const modeBtn = document.getElementById('modeBtn');
const rDownloadBtn = document.getElementById('rDownloadBtn');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    rTitle.innerText = bookTitle;

    if (!fileUrl) {
        rLoader.innerHTML = `<span style="color:#ef4444;">⚠️ Error: Document link missing!</span>`;
        return;
    }

    if (fileType === 'pdf') {
        initPdfEngine(fileUrl);
    } else if (fileType === 'html') {
        initHtmlEngine(fileUrl); 
    } else if (fileType === 'manga') {
        initMangaEngine(fileUrl);
    }
});

// ==================== PDF ENGINE ====================
function initPdfEngine(url) {
    modeBtn.style.display = 'none';
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    
    setTimeout(() => {
        rLoader.style.display = 'none';
        pdfWrapper.style.display = 'block';
        pdfWrapper.innerHTML = `<iframe src="${viewerUrl}" style="width:100%; height:100%; border:none; background-color:#000000;"></iframe>`;
    }, 1000);
}

// ==================== HTML ENGINE ====================
async function initHtmlEngine(readUrl) {
    modeBtn.style.display = 'none';
    pdfWrapper.style.display = 'block'; 
    
    try {
        // Safe 12-second limit
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(readUrl)}`;
        const response = await fetch(proxyUrl, { signal: controller.signal });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Proxy fetch failed");
        
        let bookHtml = await response.text();
        if (!bookHtml || bookHtml.length < 100) throw new Error("Empty content");

        const baseUrl = readUrl.substring(0, readUrl.lastIndexOf('/') + 1);

        const premiumStyling = `
            <base href="${baseUrl}">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap');
                body { background-color: #000000 !important; color: #e4e4e7 !important; font-family: 'Playfair Display', Georgia, serif !important; line-height: 1.8 !important; padding: 60px 8% 3rem !important; max-width: 800px !important; margin: 0 auto !important; font-size: 1.15rem !important; }
                h1, h2, h3, h4, h5 { color: #ffffff !important; font-family: 'Inter', sans-serif !important; text-align: center !important; margin-top: 3rem !important; font-weight: 600 !important; }
                p { margin-bottom: 1.5rem !important; text-align: justify !important; }
                a { color: #c9a050 !important; text-decoration: none !important; }
                img { max-width: 100% !important; height: auto !important; border-radius: 8px !important; display: block; margin: 2rem auto !important; }
            </style>
        `;

        if (bookHtml.includes('</head>')) {
            bookHtml = bookHtml.replace('</head>', premiumStyling + '</head>');
        } else {
            bookHtml = premiumStyling + bookHtml; 
        }

        rLoader.style.display = 'none'; 
        pdfWrapper.innerHTML = `<iframe id="premiumFrame" style="width:100%; height:100%; border:none; background-color:#000000;"></iframe>`;
        
        setTimeout(() => {
            const frame = document.getElementById('premiumFrame');
            if (frame) {
                const frameDoc = frame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(bookHtml);
                frameDoc.close();
            }
        }, 150);

    } catch (error) {
        console.error("Reader Error:", error);
        // Agar book fail hui, toh Error screen with direct Original Link aayega
        rLoader.innerHTML = `<div style="text-align:center; padding:2rem; color:#ef4444;">
            <h3 style="margin-bottom:10px;">⚠️ Heavy Book File</h3>
            <p style="color:#a1a1aa; font-size: 0.95rem; max-width: 300px; margin: 0 auto 20px;">This book is too large for the dark mode engine. Please read the original version.</p>
            <a href="${readUrl}" target="_blank" style="background:#ffffff; color:#000000; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:600;">📖 Read Original</a>
        </div>`;
    }
}

// ==================== MANGA ENGINE ====================
function initMangaEngine(apiUrl) {
    modeBtn.style.display = 'flex'; 
    rLoader.innerHTML = `<span style="color:#a1a1aa;">Manga Module Coming Soon...</span>`;
}

// ==================== UI CONTROLS ====================
let lastScrollTop = 0;
readerContainer.addEventListener('scroll', () => {
    let currentScroll = readerContainer.scrollTop;
    if (currentScroll > lastScrollTop && currentScroll > 60) {
        readerTopbar.classList.add('hidden');
    } else {
        readerTopbar.classList.remove('hidden');
    }
    lastScrollTop = currentScroll;
});

backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
});

// ==================== FAIL-SAFE DOWNLOAD LOGIC ====================
rDownloadBtn.addEventListener('click', () => {
    if (fileType === 'manga') {
        alert("Manga ZIP download will be ready soon!");
        return;
    }

    if (!dlUrl || dlUrl === 'undefined' || dlUrl === '') {
        alert("Download file is not available for this specific book.");
        return;
    }

    const originalText = rDownloadBtn.innerHTML;
    rDownloadBtn.innerHTML = `<span>⏳ Opening...</span>`;
    
    // Cross-origin safe download method
    window.open(dlUrl, '_blank');
    
    setTimeout(() => { rDownloadBtn.innerHTML = originalText; }, 2000);
});
