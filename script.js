// Aage chal kar jab hum multiple pages banayenge, 
// toh ye script decide karegi ki kis card pe click karne se kahan jana hai.

document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSection = card.getAttribute('data-target');
            
            // Abhi ke liye hum console aur alert use kar rahe hain
            // Baad mein yahan hum page routing ya dynamic UI load karne ka logic likhenge.
            console.log(`Navigating to: ${targetSection}`);
            
            if(targetSection === 'ncert-solutions') {
                alert("Opening Solutions Section... (Note: Yeh baad mein NCERT books ke andar bhi integrated milega)");
            } else {
                alert(`Opening ${targetSection.replace('-', ' ')}...`);
            }
            
            // Future Code Example:
            // window.location.href = `explore.html?section=${targetSection}`;
        });
    });
});
