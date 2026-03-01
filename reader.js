// ==================== MASTER READER ENGINE ====================

// 1. URL Se Data Nikalna (Routing)
const urlParams = new URLSearchParams(window.location.search);
const fileUrl = urlParams.get('url');
const fileType = urlParams.get('type') || 'pdf'; // Default 'pdf'
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
    // Title Set Karo
    rTitle.innerText = decodeURIComponent(bookTitle);

    // Agar URL nahi mila toh error dikhao
    if (!fileUrl) {
        loaderText.innerHTML = `<span style="color:#ef4444;">⚠️ Error: No file link provided!</span>`;
        document.querySelector('.spinner').style.display = 'none';
        return;
    }

    // Engine Switcher
    if (fileType === 'pdf') {
        initPdfEngine(decodeURIComponent(fileUrl));
    } else if (fileType === 'manga') {
        initMangaEngine(decodeURIComponent(fileUrl));
    }
});

// ==================== PDF ENGINE ====================
function initPdfEngine(url) {
    // Hide Manga controls
    modeBtn.style.display = 'none';
    
    // Inject Fast PDF Viewer (Google Docs Engine for now, handles large PDFs smoothly)
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    
    // Thoda wait karke loader hatayenge taaki iframe load ho jaye
    setTimeout(() => {
        rLoader.style.display = 'none';
        pdfWrapper.style.display = 'block';
        pdfWrapper.innerHTML = `<iframe src="${viewerUrl}" frameborder="0" allowfullscreen></iframe>`;
    }, 1000);
}

// ==================== MANGA ENGINE (Demo Structure) ====================
function initMangaEngine(apiUrl) {
    modeBtn.style.display = 'flex'; // Manga mode change karne ka button dikhao
    
    // Jab hum scraper banayenge, toh apiUrl se images yahan aayengi.
    // Abhi test karne ke liye main dummy images daal raha hoon:
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
            img.loading = 'lazy'; // Lazy loading for performance
            img.alt = `Page ${index + 1}`;
            mangaWrapper.appendChild(img);
        });
    }, 1500);
}

// ==================== UI CONTROLS & ANIMATIONS ====================

// 1. Auto-Hide Topbar on Scroll
let lastScrollTop = 0;
readerContainer.addEventListener('scroll', () => {
    let currentScroll = readerContainer.scrollTop;
    
    // Agar 60px se zyada niche gaye aur scroll down kar rahe hain
    if (currentScroll > lastScrollTop && currentScroll > 60) {
        readerTopbar.classList.add('hidden'); // Chup jao
    } else {
        readerTopbar.classList.remove('hidden'); // Wapas aao
    }
    lastScrollTop = currentScroll;
});

// 2. Go Back Button
backBtn.addEventListener('click', () => {
    // Agar pichla page hai toh wapas jao, warna homepage pe jao
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
});

// 3. Download Button Logic
rDownloadBtn.addEventListener('click', () => {
    if (!fileUrl) return;
    
    const originalText = rDownloadBtn.innerHTML;
    rDownloadBtn.innerHTML = `<span>⏳ Saving...</span>`;
    
    if (fileType === 'pdf') {
        // Direct Download for PDF
        const a = document.createElement('a');
        a.href = decodeURIComponent(fileUrl);
        a.target = '_blank';
        a.download = `${decodeURIComponent(bookTitle)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // Manga Download Logic (Future ZIP Builder)
        alert("Manga ZIP download will be ready soon!");
    }
    
    setTimeout(() => { rDownloadBtn.innerHTML = originalText; }, 2000);
});
