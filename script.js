// Optimized Particle System - DIKURANGI BANYAK UNTUK PERFORMANCE
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 40; // DIKURANGI DRASTIS dari 200 menjadi 40
        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };
        this.animationId = null;
        
        this.init();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.touchMove(e));
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    mouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    touchMove(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }
    
    animate() {
        // Clear canvas dengan opacity rendah untuk trail effect
        this.ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles - DIKURANGI KOMPLEKSITAS
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse);
            this.particles[i].draw(this.ctx);
            
            // Hapus koneksi garis antar partikel untuk hemat performance
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Method untuk stop animation jika perlu
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1; // DIKECILKAN
        this.speedX = Math.random() * 1 - 0.5; // DIPERLAMBAT
        this.speedY = Math.random() * 1 - 0.5; // DIPERLAMBAT
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.4 + 0.1; // DIKURANGI
        this.originalSize = this.size;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(103, 58, 183, ALPHA)',    // Purple
            'rgba(233, 30, 99, ALPHA)',     // Pink
            'rgba(33, 150, 243, ALPHA)',    // Blue
        ];
        return colors[Math.floor(Math.random() * colors.length)].replace('ALPHA', this.alpha);
    }
    
    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse interaction - DISEDERHANAKAN
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            this.size = this.originalSize * 2;
        } else {
            this.size = this.originalSize;
        }
        
        // Bounce off walls
        if (this.x <= 0 || this.x >= this.canvasWidth) this.speedX *= -1;
        if (this.y <= 0 || this.y >= this.canvasHeight) this.speedY *= -1;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    get canvasWidth() {
        return window.innerWidth;
    }
    
    get canvasHeight() {
        return window.innerHeight;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize optimized particle system
    const particleSystem = new ParticleSystem();
    
    // Enhanced button interactions - TETAP SMOOTH
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        let hoverTimeout;
        
        button.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            this.style.transform = 'translateY(-8px) scale(1.03)';
        });
        
        button.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 100);
        });
        
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.8s ease-out;
                pointer-events: none;
                z-index: 2;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .main-content {
            animation: contentFloat 6s ease-in-out infinite;
        }
        
        @keyframes contentFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        
        html {
            scroll-behavior: smooth;
        }
        
        /* Performance optimizations */
        .main-content, .btn, .logo-inner {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);
    
    // Add staggered animation to info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.style.animation = `fadeInUp 0.6s ease-out ${index * 0.2}s both`;
    });
    
    // Add CSS for info items animation
    const infoStyle = document.createElement('style');
    infoStyle.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(infoStyle);
    
    // Ensure page is scrollable and performant
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Optional: Stop particles when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            particleSystem.stop();
        } else {
            particleSystem.animate();
        }
    });
});
