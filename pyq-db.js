// ==================== PYQ MASTER DATABASE ====================
// Google Drive Link Hack: Replace 'file/d/XYZ/view' with 'uc?export=download&id=XYZ'

const pyqData = {
    "CBSE": {
        "2024": {
            "Mathematics": [
                { title: "Maths Standard Set-1", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE" },
                { title: "Marking Scheme (Solutions)", link: "#" }
            ],
            "Science": [
                { title: "Science Set-1", link: "#" },
                { title: "Science Set-2", link: "#" }
            ]
        },
        "2023": {
            "Mathematics": [
                { title: "Maths Basic Set-1", link: "#" }
            ],
            "English": [
                { title: "English Language & Lit Set-1", link: "#" }
            ]
        }
    },
    // Future me yahan "ICSE", "UP Board" add kar sakte hain
};

const boardsList = [
    { id: "CBSE", name: "CBSE Board", status: "active", icon: "📚" },
    { id: "ICSE", name: "ICSE Board", status: "coming_soon", icon: "🏛️" },
    { id: "UP", name: "UP Board", status: "coming_soon", icon: "📝" }
];
