// ==================== PYQ MASTER DATABASE ====================
// Naya Flow: Board -> Class -> Subject -> Year -> Papers
// Google Drive Link Hack: Replace 'file/d/XYZ/view' with 'uc?export=download&id=XYZ'

const pyqData = {
    "CBSE": {
        "Class 12": {
            "Accountancy": { "2024": [{ title: "Accountancy Set-1", link: "#" }] },
            "Biology": { "2024": [{ title: "Biology Set-1", link: "#" }] },
            "Business Studies": { "2024": [{ title: "Business Studies Set-1", link: "#" }] },
            "Chemistry": { "2024": [{ title: "Chemistry Set-1", link: "#" }] },
            "English": { "2024": [{ title: "English Core Set-1", link: "#" }] },
            "Economics": { "2024": [{ title: "Economics Set-1", link: "#" }] },
            "Geography": { "2024": [{ title: "Geography Set-1", link: "#" }] },
            "Hindi": { "2024": [{ title: "Hindi Elective Set-1", link: "#" }] },
            "History": { "2024": [{ title: "History Set-1", link: "#" }] },
            "Home Science": { "2024": [{ title: "Home Science Set-1", link: "#" }] },
            "Mathematics": { 
                "2025": [{ title: "Maths Standard Set-1", link: "#" }],
                "2024": [
                    { title: "Maths Standard Set-1", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE" },
                    { title: "Marking Scheme (Solutions)", link: "#" }
                ],
                "2023": [{ title: "Maths Standard Set-1", link: "#" }],
                "2022": [{ title: "Maths Standard Set-1", link: "#" }],
                "2021": [{ title: "Maths Standard Set-1", link: "#" }],
                "2020": [{ title: "Maths Standard Set-1", link: "#" }]
            },
            "Physics": { 
                "2025": [{ title: "Physics Set-1", link: "#" }],
                "2024": [{ title: "Physics Set-1", link: "#" }],
                "2023": [{ title: "Physics Set-1", link: "#" }],
                "2022": [{ title: "Physics Set-1", link: "#" }],
                "2021": [{ title: "Physics Set-1", link: "#" }],
                "2020": [{ title: "Physics Set-1", link: "#" }]
            },
            "Political Science": { "2024": [{ title: "Political Science Set-1", link: "#" }] },
            "Sanskrit": { "2024": [{ title: "Sanskrit Set-1", link: "#" }] }
        },
        "Class 10": {
            "Economics": { "2024": [{ title: "Economics Set-1", link: "#" }] },
            "English": { "2024": [{ title: "English Lang & Lit Set-1", link: "#" }] },
            "Geography": { "2024": [{ title: "Geography Set-1", link: "#" }] },
            "Hindi": { "2024": [{ title: "Hindi Course A Set-1", link: "#" }] },
            "History": { "2024": [{ title: "History Set-1", link: "#" }] },
            "Mathematics": { 
                "2025": [{ title: "Maths Standard Set-1", link: "#" }],
                "2024": [
                    { title: "Maths Standard Set-1", link: "#" },
                    { title: "Maths Basic Set-1", link: "#" }
                ],
                "2023": [{ title: "Maths Standard Set-1", link: "#" }],
                "2022": [{ title: "Maths Standard Set-1", link: "#" }],
                "2021": [{ title: "Maths Standard Set-1", link: "#" }],
                "2020": [{ title: "Maths Standard Set-1", link: "#" }]
            },
            "Political Science": { "2024": [{ title: "Political Science Set-1", link: "#" }] },
            "Sanskrit": { "2024": [{ title: "Sanskrit Set-1", link: "#" }] },
            "Science": { 
                "2025": [{ title: "Science Set-1", link: "#" }],
                "2024": [{ title: "Science Set-1", link: "#" }],
                "2023": [{ title: "Science Set-1", link: "#" }],
                "2022": [{ title: "Science Set-1", link: "#" }],
                "2021": [{ title: "Science Set-1", link: "#" }],
                "2020": [{ title: "Science Set-1", link: "#" }]
            },
            "Social Science": { "2024": [{ title: "SST Set-1", link: "#" }] }
        }
    }
};

const boardsList = [
    { id: "CBSE", name: "CBSE Board", status: "active", icon: "📚" },
    { id: "ICSE", name: "ICSE Board", status: "coming_soon", icon: "🏛️" },
    { id: "UP", name: "UP Board", status: "coming_soon", icon: "📝" }
];
