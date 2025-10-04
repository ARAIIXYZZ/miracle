// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    
    // Efek Parallax Halus pada Mouse Movement (PC)
    function handleMouseMove(e) {
        if (window.innerWidth <= 600) return; // Nonaktif di Mobile
        
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        container.style.transform = `translate(${-x}px, ${-y}px)`;
    }

    // Hanya aktifkan efek ini jika user menggunakan PC (lebar layar besar)
    if (window.innerWidth > 600) {
        document.addEventListener('mousemove', handleMouseMove);
    }
});
