// ==================== PYQ ENGINE ====================

// State Variables (Track what user selected)
let currentBoard = null;
let currentYear = null;
let currentSubject = null;

// DOM Elements
const breadcrumb = document.getElementById('breadcrumb');
const contentArea = document.getElementById('contentArea');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderBoards(); // Step 1: Show Boards
});

// Update Breadcrumb UI
function updateBreadcrumb() {
    let html = `<span onclick="renderBoards()">Select Board</span>`;
    
    if (currentBoard) {
        html += ` <span>›</span> <span onclick="renderYears('${currentBoard}')" class="${!currentYear ? 'active' : ''}">${currentBoard}</span>`;
    }
    if (currentYear) {
        html += ` <span>›</span> <span onclick="renderSubjects('${currentYear}')" class="${!currentSubject ? 'active' : ''}">${currentYear}</span>`;
    }
    if (currentSubject) {
        html += ` <span>›</span> <span class="active">${currentSubject}</span>`;
    }
    
    breadcrumb.innerHTML = html;
}

// ==================== RENDER FUNCTIONS ====================

// 1. Show Boards
function renderBoards() {
    currentBoard = null; currentYear = null; currentSubject = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    boardsList.forEach(board => {
        const card = document.createElement('div');
        const isDisabled = board.status === "coming_soon";
        card.className = `selection-card ${isDisabled ? 'disabled' : ''}`;
        
        card.innerHTML = `
            <div style="font-size: 2.5rem;">${board.icon}</div>
            <h3>${board.name}</h3>
            <p>${isDisabled ? 'Coming Soon ⏳' : 'Tap to select years'}</p>
        `;

        if (!isDisabled) {
            card.onclick = () => renderYears(board.id);
        }
        contentArea.appendChild(card);
    });
}

// 2. Show Years
function renderYears(boardId) {
    currentBoard = boardId; currentYear = null; currentSubject = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const years = Object.keys(pyqData[boardId]).sort((a, b) => b - a); // Sort newest first

    years.forEach(year => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">📅</div>
            <h3>${year}</h3>
            <p>View all subjects</p>
        `;
        card.onclick = () => renderSubjects(year);
        contentArea.appendChild(card);
    });
}

// 3. Show Subjects
function renderSubjects(year) {
    currentYear = year; currentSubject = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const subjects = Object.keys(pyqData[currentBoard][currentYear]);

    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">📖</div>
            <h3>${subject}</h3>
            <p>Download Papers & Solutions</p>
        `;
        card.onclick = () => renderPapers(subject);
        contentArea.appendChild(card);
    });
}

// 4. Show Download Links (Final Step)
function renderPapers(subject) {
    currentSubject = subject;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const papers = pyqData[currentBoard][currentYear][subject];

    // Grid layout change for horizontal paper cards
    contentArea.style.gridTemplateColumns = "1fr"; 

    papers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'paper-card';
        
        // Native Download Link setup
        card.innerHTML = `
            <div class="paper-info">
                <h3>📄 ${paper.title}</h3>
                <p style="color:#a1a1aa; font-size:0.85rem;">Official Board Paper - One Click Download</p>
            </div>
            <a href="${paper.link}" class="dl-btn" target="_blank" download>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download
            </a>
        `;
        contentArea.appendChild(card);
    });

    // Reset grid layout if user goes back
    const originalGrid = () => contentArea.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
    breadcrumb.addEventListener('click', originalGrid, { once: true });
}
