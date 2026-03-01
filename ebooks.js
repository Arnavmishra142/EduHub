// ==================== MASTER READER ENGINE ====================

// 1. URL Se Data Nikalna
const urlParams = new URLSearchParams(window.location.search);
const fileUrl = urlParams.get('url');
const fileType = urlParams.get('type') || 'pdf'; // 'pdf', 'html', or 'manga'
const bookTitle = urlParams.get('title') || 'EduHub Premium Reader';

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
    rTitle.innerText = decodeURIComponent(bookTitle);

    if (!fileUrl) {
        loaderText.innerHTML = `<span style="color:#ef4444;">⚠️ Error: No file link provided!</span>`;
        document.querySelector('.spinner').style.display = 'none';
        return;
    }

    const decodedUrl = decodeURIComponent(fileUrl);

    // 🚀 ENGINE SWITCHER
    if (fileType === 'pdf') {
        initPdfEngine(decodedUrl);
    } else if (fileType === 'html') {
        initHtmlEngine(decodedUrl); // YEH MISSING THA PEHLE!
    } else if (fileType === 'manga') {
        initMangaEngine(decodedUrl);
    }
});

// ==================== 1. PDF ENGINE ====================
function initPdfEngine(url) {
    modeBtn.style.display = 'none';
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    
    setTimeout(() => {
        rLoader.style.display = 'none';
        pdfWrapper.style.display = 'block';
        pdfWrapper.innerHTML = `<iframe src="${viewerUrl}" style="width:100%; height:100%; border:none; background-color:#000000;"></iframe>`;
    }, 1000);
}

// ==================== 2. HTML (E-BOOK) ENGINE ====================
async function initHtmlEngine(readUrl) {
    modeBtn.style.display = 'none';
    pdfWrapper.style.display = 'block'; 
    
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(readUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Proxy fetch failed");
        
        let bookHtml = await response.text();
        if (!bookHtml) throw new Error("Empty content received");

        const baseUrl = readUrl.substring(0, readUrl.lastIndexOf('/') + 1);

        // Premium Dark Theme Injection
        const premiumStyling = `
            <base href="${baseUrl}">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap');
                body { background-color: #000000 !important; color: #e4e4e7 !important; font-family: 'Playfair Display', Georgia, serif !important; line-height: 1.8 !important; padding: 60px 8% 3rem !important; max-width: 800px !important; margin: 0 auto !important; font-size: 1.15rem !important; }
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
        }, 100);

    } catch (error) {
        console.error("Reader Error:", error);
        rLoader.innerHTML = `<div style="text-align:center; padding:3rem; color:#ef4444; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <h3 style="margin-bottom:10px;">⚠️ Could not load the dark reader</h3>
            <p style="color:#a1a1aa; max-width: 400px; line-height:1.5;">The book file is either too large or the server blocked our custom request.</p>
            <a href="${readUrl}" target="_blank" style="margin-top:25px; display:inline-block; background:#ffffff; color:#000000; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; transition: 0.2s;">📖 Read Original Version</a>
        </div>`;
    }
}

// ==================== 3. MANGA ENGINE ====================
function initMangaEngine(apiUrl) {
    modeBtn.style.display = 'flex'; 
    const mockMangaImages = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=1200&fit=crop"
    ];

    setTimeout(() => {
        rLoader.style.display = 'none';
        mangaWrapper.style.display = 'flex';
        
        mockMangaImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'manga-page';
            img.loading = 'lazy';
            img.alt = `Page ${index + 1}`;
            mangaWrapper.appendChild(img);
        });
    }, 1500);
}

// ==================== UI CONTROLS ====================

// Auto-Hide Topbar
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

// Back Button
backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
});

// 🚀 FIXED DOWNLOAD LOGIC
rDownloadBtn.addEventListener('click', () => {
    if (!fileUrl) return;
    
    const originalText = rDownloadBtn.innerHTML;
    rDownloadBtn.innerHTML = `<span>⏳ Saving...</span>`;
    
    // Agar manga hai tabhi ZIP alert aayega
    if (fileType === 'manga') {
        alert("Manga ZIP download will be ready soon!");
    } 
    // PDF aur HTML ke liye direct download chalega bina warning ke
    else {
        const a = document.createElement('a');
        a.href = decodeURIComponent(fileUrl);
        a.target = '_blank';
        a.download = `${decodeURIComponent(bookTitle)}_EduHub`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    setTimeout(() => { rDownloadBtn.innerHTML = originalText; }, 2000);
});
