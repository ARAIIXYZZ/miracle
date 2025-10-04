// Enhanced Particle System with MORE PARTICLES
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 200; // DITAMBAH dari 100 menjadi 200
        this.mouse = {
            x: 0,
            y: 0,
            radius: 150
        };
        
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
        this.ctx.fillStyle = 'rgba(12, 12, 12, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse);
            this.particles[i].draw(this.ctx);
            
            // Connect particles with lines - LEBIH BANYAK KONEKSI
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) { // JARAK DIKURANGI untuk lebih banyak koneksi
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance/120)})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5; // LEBIH CEPAT
        this.speedY = Math.random() * 3 - 1.5; // LEBIH CEPAT
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.8 + 0.2; // LEBIH TERANG
        this.originalSize = this.size;
        this.oscillation = Math.random() * Math.PI * 2;
        this.oscillationSpeed = Math.random() * 0.03 + 0.01; // VARIASI KECEPATAN
    }
    
    getRandomColor() {
        const colors = [
            'rgba(103, 58, 183, ALPHA)',    // Purple
            'rgba(233, 30, 99, ALPHA)',     // Pink
            'rgba(33, 150, 243, ALPHA)',    // Blue
            'rgba(255, 87, 34, ALPHA)',     // Orange
            'rgba(76, 175, 80, ALPHA)',     // Green
            'rgba(255, 193, 7, ALPHA)',     // Yellow
            'rgba(156, 39, 176, ALPHA)',    // Deep Purple
            'rgba(255, 255, 255, ALPHA)'    // White
        ];
        return colors[Math.floor(Math.random() * colors.length)].replace('ALPHA', this.alpha);
    }
    
    update(mouse) {
        // Oscillation movement dengan variasi kecepatan
        this.oscillation += this.oscillationSpeed;
        this.x += this.speedX + Math.sin(this.oscillation) * 0.8;
        this.y += this.speedY + Math.cos(this.oscillation) * 0.8;
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            this.size = this.originalSize * 3;
            // Push particles away from mouse
            const force = (mouse.radius - distance) / mouse.radius;
            this.speedX = -dx * 0.03 * force;
            this.speedY = -dy * 0.03 * force;
        } else {
            this.size = this.originalSize;
        }
        
        // Bounce off walls dengan lebih smooth
        if (this.x <= 0 || this.x >= this.canvasWidth) {
            this.speedX *= -0.8;
            this.x = this.x <= 0 ? 1 : this.canvasWidth - 1;
        }
        if (this.y <= 0 || this.y >= this.canvasHeight) {
            this.speedY *= -0.8;
            this.y = this.y <= 0 ? 1 : this.canvasHeight - 1;
        }
        
        // Slow down over time
        this.speedX *= 0.998;
        this.speedY *= 0.998;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Enhanced glow effect
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color.replace('rgba', 'rgb').replace(/,[^)]+\)/, ')');
        
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        // Random shape for variety
        if (Math.random() > 0.7) {
            // Star shape occasionally
            this.drawStar(ctx, this.x, this.y, this.size, this.size * 0.5, 5);
        } else {
            // Circle shape
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        
        ctx.fill();
        
        ctx.restore();
    }
    
    drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {
        const rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / points;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < points; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
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
    // Initialize enhanced particle system with MORE PARTICLES
    new ParticleSystem();
    
    // Enhanced button interactions
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
        
        // Enhanced ripple effect on click
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
    
    // Add CSS for enhanced ripple animation
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
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-5px) rotate(0.5deg); }
            66% { transform: translateY(3px) rotate(-0.5deg); }
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // Text animation for main name
    const mainName = document.querySelector('.main-name');
    const originalText = mainName.textContent;
    
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
    
    // Ensure page is scrollable on all devices
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
});
