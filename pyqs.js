// ==================== ADVANCED PYQ ENGINE ====================

// State Variables (Track what user selected)
let currentBoard = null;
let currentClass = null;
let currentSubject = null;
let currentYear = null;

// DOM Elements
const breadcrumb = document.getElementById('breadcrumb');
const contentArea = document.getElementById('contentArea');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderBoards(); 
});

// Update Breadcrumb UI
function updateBreadcrumb() {
    let html = `<span onclick="renderBoards()">Select Board</span>`;
    
    if (currentBoard) {
        html += ` <span>›</span> <span onclick="renderClasses('${currentBoard}')" class="${!currentClass ? 'active' : ''}">${currentBoard}</span>`;
    }
    if (currentClass) {
        html += ` <span>›</span> <span onclick="renderSubjects('${currentClass}')" class="${!currentSubject ? 'active' : ''}">${currentClass}</span>`;
    }
    if (currentSubject) {
        html += ` <span>›</span> <span onclick="renderYears('${currentSubject}')" class="${!currentYear ? 'active' : ''}">${currentSubject}</span>`;
    }
    if (currentYear) {
        html += ` <span>›</span> <span class="active">${currentYear}</span>`;
    }
    
    breadcrumb.innerHTML = html;
}

// ==================== RENDER FUNCTIONS ====================

// 1. Show Boards
function renderBoards() {
    currentBoard = null; currentClass = null; currentSubject = null; currentYear = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';
    contentArea.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";

    boardsList.forEach(board => {
        const card = document.createElement('div');
        const isDisabled = board.status === "coming_soon";
        card.className = `selection-card ${isDisabled ? 'disabled' : ''}`;
        card.innerHTML = `
            <div style="font-size: 2.5rem;">${board.icon}</div>
            <h3>${board.name}</h3>
            <p>${isDisabled ? 'Coming Soon ⏳' : 'Tap to select Class'}</p>
        `;
        if (!isDisabled) card.onclick = () => renderClasses(board.id);
        contentArea.appendChild(card);
    });
}

// 2. Show Classes (10th & 12th)
function renderClasses(boardId) {
    currentBoard = boardId; currentClass = null; currentSubject = null; currentYear = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const classes = Object.keys(pyqData[boardId]); // Gets "Class 12" and "Class 10"

    classes.forEach(cls => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">${cls === 'Class 12' ? '🎓' : '🎒'}</div>
            <h3>${cls}</h3>
            <p>Select your class</p> 
        `;
        card.onclick = () => renderSubjects(cls);
        contentArea.appendChild(card);
    });
}

// 3. Show Subjects
function renderSubjects(cls) {
    currentClass = cls; currentSubject = null; currentYear = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const subjects = Object.keys(pyqData[currentBoard][currentClass]).sort(); // Alphabetical sort

    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">📖</div>
            <h3>${subject}</h3>
            <p>View previous years</p>
        `;
        card.onclick = () => renderYears(subject);
        contentArea.appendChild(card);
    });
}

// 4. Show Years
function renderYears(subject) {
    currentSubject = subject; currentYear = null;
    updateBreadcrumb();
    contentArea.innerHTML = '';

    const years = Object.keys(pyqData[currentBoard][currentClass][currentSubject]).sort((a, b) => b - a);

    years.forEach(year => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.innerHTML = `
            <div style="font-size: 2.5rem;">📅</div>
            <h3>${year}</h3>
            <p>Download Papers</p>
        `;
        card.onclick = () => renderPapers(year);
        contentArea.appendChild(card);
    });
}

// 5. Show Download Links (Final Step)
function renderPapers(year) {
    currentYear = year;
    updateBreadcrumb();
    contentArea.innerHTML = '';
    contentArea.style.gridTemplateColumns = "1fr"; // Change to list view

    const papers = pyqData[currentBoard][currentClass][currentSubject][currentYear];

    papers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'paper-card';
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
}
