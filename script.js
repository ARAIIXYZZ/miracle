// Efek interaktif untuk tombol
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    // Efek ripple pada tombol
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Membuat elemen ripple
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            // Menambahkan ripple ke tombol
            this.appendChild(ripple);
            
            // Menghapus ripple setelah animasi selesai
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Efek parallax untuk background
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelector('.particles');
        const glow = document.querySelector('.glow-effect');
        
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        particles.style.transform = `translate(${moveX}px, ${moveY}px)`;
        glow.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`;
    });
    
    // Efek ketik untuk nama
    const profileName = document.querySelector('.profile-name');
    const originalText = profileName.textContent;
    profileName.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            profileName.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Mulai efek ketik setelah halaman dimuat
    setTimeout(typeWriter, 500);
});

// Menambahkan style untuk efek ripple
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
