// ==================== PYQ MASTER DATABASE ====================
// Naya Flow: Board -> Class -> Subject -> Year -> Papers
// Google Drive Link Hack: Replace 'file/d/XYZ/view' with 'uc?export=download&id=XYZ'

const pyqData = {
    "CBSE": {
        "Class 12": {
            "Accountancy": { 
                "2025": [{ title: "Accountancy Set-1", link: "#" }], "2024": [{ title: "Accountancy Set-1", link: "#" }], "2023": [{ title: "Accountancy Set-1", link: "#" }], "2022": [{ title: "Accountancy Set-1", link: "#" }], "2021": [{ title: "Accountancy Set-1", link: "#" }], "2020": [{ title: "Accountancy Set-1", link: "#" }]
            },
            "Biology": { 
                "2025": [{ title: "Biology Set-1", link: "#" }], "2024": [{ title: "Biology Set-1", link: "#" }], "2023": [{ title: "Biology Set-1", link: "#" }], "2022": [{ title: "Biology Set-1", link: "#" }], "2021": [{ title: "Biology Set-1", link: "#" }], "2020": [{ title: "Biology Set-1", link: "#" }]
            },
            "Business Studies": { 
                "2025": [{ title: "Business Studies Set-1", link: "#" }], "2024": [{ title: "Business Studies Set-1", link: "#" }], "2023": [{ title: "Business Studies Set-1", link: "#" }], "2022": [{ title: "Business Studies Set-1", link: "#" }], "2021": [{ title: "Business Studies Set-1", link: "#" }], "2020": [{ title: "Business Studies Set-1", link: "#" }]
            },
            "Chemistry": { 
                "2025": [{ title: "Chemistry Set-1", link: "#" }], "2024": [{ title: "Chemistry Set-1", link: "#" }], "2023": [{ title: "Chemistry Set-1", link: "#" }], "2022": [{ title: "Chemistry Set-1", link: "#" }], "2021": [{ title: "Chemistry Set-1", link: "#" }], "2020": [{ title: "Chemistry Set-1", link: "#" }]
            },
            "English": { 
                "2025": [{ title: "English Core Set-1", link: "#" }], "2024": [{ title: "English Core Set-1", link: "#" }], "2023": [{ title: "English Core Set-1", link: "#" }], "2022": [{ title: "English Core Set-1", link: "#" }], "2021": [{ title: "English Core Set-1", link: "#" }], "2020": [{ title: "English Core Set-1", link: "#" }]
            },
            "Economics": { 
                "2025": [{ title: "Economics Set-1", link: "#" }], "2024": [{ title: "Economics Set-1", link: "#" }], "2023": [{ title: "Economics Set-1", link: "#" }], "2022": [{ title: "Economics Set-1", link: "#" }], "2021": [{ title: "Economics Set-1", link: "#" }], "2020": [{ title: "Economics Set-1", link: "#" }]
            },
            "Geography": { 
                "2025": [{ title: "Geography Set-1", link: "#" }], "2024": [{ title: "Geography Set-1", link: "#" }], "2023": [{ title: "Geography Set-1", link: "#" }], "2022": [{ title: "Geography Set-1", link: "#" }], "2021": [{ title: "Geography Set-1", link: "#" }], "2020": [{ title: "Geography Set-1", link: "#" }]
            },
            "Hindi": { 
                "2025": [{ title: "Hindi Elective Set-1", link: "#" }], "2024": [{ title: "Hindi Elective Set-1", link: "#" }], "2023": [{ title: "Hindi Elective Set-1", link: "#" }], "2022": [{ title: "Hindi Elective Set-1", link: "#" }], "2021": [{ title: "Hindi Elective Set-1", link: "#" }], "2020": [{ title: "Hindi Elective Set-1", link: "#" }]
            },
            "History": { 
                "2025": [{ title: "History Set-1", link: "#" }], "2024": [{ title: "History Set-1", link: "#" }], "2023": [{ title: "History Set-1", link: "#" }], "2022": [{ title: "History Set-1", link: "#" }], "2021": [{ title: "History Set-1", link: "#" }], "2020": [{ title: "History Set-1", link: "#" }]
            },
            "Home Science": { 
                "2025": [{ title: "Home Science Set-1", link: "#" }], "2024": [{ title: "Home Science Set-1", link: "#" }], "2023": [{ title: "Home Science Set-1", link: "#" }], "2022": [{ title: "Home Science Set-1", link: "#" }], "2021": [{ title: "Home Science Set-1", link: "#" }], "2020": [{ title: "Home Science Set-1", link: "#" }]
            },
            "Mathematics": { 
                "2025": [{ title: "Maths Standard Set-1", link: "#" }], 
                "2024": [
                    { title: "Maths Standard Set-1", link: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_HERE" },
                    { title: "Marking Scheme (Solutions)", link: "#" }
                ], 
                "2023": [{ title: "Maths Standard Set-1", link: "#" }], "2022": [{ title: "Maths Standard Set-1", link: "#" }], "2021": [{ title: "Maths Standard Set-1", link: "#" }], "2020": [{ title: "Maths Standard Set-1", link: "#" }]
            },
            "Physics": { 
                "2025": [{ title: "Physics Set-1", link: "#" }], "2024": [{ title: "Physics Set-1", link: "#" }], "2023": [{ title: "Physics Set-1", link: "#" }], "2022": [{ title: "Physics Set-1", link: "#" }], "2021": [{ title: "Physics Set-1", link: "#" }], "2020": [{ title: "Physics Set-1", link: "#" }]
            },
            "Political Science": { 
                "2025": [{ title: "Political Science Set-1", link: "#" }], "2024": [{ title: "Political Science Set-1", link: "#" }], "2023": [{ title: "Political Science Set-1", link: "#" }], "2022": [{ title: "Political Science Set-1", link: "#" }], "2021": [{ title: "Political Science Set-1", link: "#" }], "2020": [{ title: "Political Science Set-1", link: "#" }]
            },
            "Sanskrit": { 
                "2025": [{ title: "Sanskrit Set-1", link: "#" }], "2024": [{ title: "Sanskrit Set-1", link: "#" }], "2023": [{ title: "Sanskrit Set-1", link: "#" }], "2022": [{ title: "Sanskrit Set-1", link: "#" }], "2021": [{ title: "Sanskrit Set-1", link: "#" }], "2020": [{ title: "Sanskrit Set-1", link: "#" }]
            }
        },
        "Class 10": {
            "Economics": { 
                "2025": [{ title: "Economics Set-1", link: "#" }], "2024": [{ title: "Economics Set-1", link: "#" }], "2023": [{ title: "Economics Set-1", link: "#" }], "2022": [{ title: "Economics Set-1", link: "#" }], "2021": [{ title: "Economics Set-1", link: "#" }], "2020": [{ title: "Economics Set-1", link: "#" }]
            },
            "English": { 
                "2025": [{ title: "English Lang & Lit Set-1", link: "#" }], "2024": [{ title: "English Lang & Lit Set-1", link: "#" }], "2023": [{ title: "English Lang & Lit Set-1", link: "#" }], "2022": [{ title: "English Lang & Lit Set-1", link: "#" }], "2021": [{ title: "English Lang & Lit Set-1", link: "#" }], "2020": [{ title: "English Lang & Lit Set-1", link: "#" }]
            },
            "Geography": { 
                "2025": [{ title: "Geography Set-1", link: "#" }], "2024": [{ title: "Geography Set-1", link: "#" }], "2023": [{ title: "Geography Set-1", link: "#" }], "2022": [{ title: "Geography Set-1", link: "#" }], "2021": [{ title: "Geography Set-1", link: "#" }], "2020": [{ title: "Geography Set-1", link: "#" }]
            },
            "Hindi": { 
                "2025": [{ title: "Hindi Course A Set-1", link: "#" }], "2024": [{ title: "Hindi Course A Set-1", link: "#" }], "2023": [{ title: "Hindi Course A Set-1", link: "#" }], "2022": [{ title: "Hindi Course A Set-1", link: "#" }], "2021": [{ title: "Hindi Course A Set-1", link: "#" }], "2020": [{ title: "Hindi Course A Set-1", link: "#" }]
            },
            "History": { 
                "2025": [{ title: "History Set-1", link: "#" }], "2024": [{ title: "History Set-1", link: "#" }], "2023": [{ title: "History Set-1", link: "#" }], "2022": [{ title: "History Set-1", link: "#" }], "2021": [{ title: "History Set-1", link: "#" }], "2020": [{ title: "History Set-1", link: "#" }]
            },
            "Mathematics": { 
                "2025": [{ title: "Maths Standard Set-1", link: "#" }], 
                "2024": [
                    { title: "Maths Standard Set-1", link: "#" },
                    { title: "Maths Basic Set-1", link: "#" }
                ], 
                "2023": [{ title: "Maths Standard Set-1", link: "#" }], "2022": [{ title: "Maths Standard Set-1", link: "#" }], "2021": [{ title: "Maths Standard Set-1", link: "#" }], "2020": [{ title: "Maths Standard Set-1", link: "#" }]
            },
            "Political Science": { 
                "2025": [{ title: "Political Science Set-1", link: "#" }], "2024": [{ title: "Political Science Set-1", link: "#" }], "2023": [{ title: "Political Science Set-1", link: "#" }], "2022": [{ title: "Political Science Set-1", link: "#" }], "2021": [{ title: "Political Science Set-1", link: "#" }], "2020": [{ title: "Political Science Set-1", link: "#" }]
            },
            "Sanskrit": { 
                "2025": [{ title: "Sanskrit Set-1", link: "#" }], "2024": [{ title: "Sanskrit Set-1", link: "#" }], "2023": [{ title: "Sanskrit Set-1", link: "#" }], "2022": [{ title: "Sanskrit Set-1", link: "#" }], "2021": [{ title: "Sanskrit Set-1", link: "#" }], "2020": [{ title: "Sanskrit Set-1", link: "#" }]
            },
            "Science": { 
                "2025": [{ title: "Science Set-1", link: "#" }], "2024": [{ title: "Science Set-1", link: "#" }], "2023": [{ title: "Science Set-1", link: "#" }], "2022": [{ title: "Science Set-1", link: "#" }], "2021": [{ title: "Science Set-1", link: "#" }], "2020": [{ title: "Science Set-1", link: "#" }]
            },
            "Social Science": { 
                "2025": [{ title: "SST Set-1", link: "#" }], "2024": [{ title: "SST Set-1", link: "#" }], "2023": [{ title: "SST Set-1", link: "#" }], "2022": [{ title: "SST Set-1", link: "#" }], "2021": [{ title: "SST Set-1", link: "#" }], "2020": [{ title: "SST Set-1", link: "#" }]
            }
        }
    }
};

const boardsList = [
    { id: "CBSE", name: "CBSE Board", status: "active", icon: "📚" },
    { id: "ICSE", name: "ICSE Board", status: "coming_soon", icon: "🏛️" },
    { id: "UP", name: "UP Board", status: "coming_soon", icon: "📝" }
];
