// Enhanced Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 100;
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
        this.ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse);
            this.particles[i].draw(this.ctx);
            
            // Connect particles with lines
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
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
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.6 + 0.2;
        this.originalSize = this.size;
        this.oscillation = Math.random() * Math.PI * 2;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(103, 58, 183, ALPHA)',    // Purple
            'rgba(233, 30, 99, ALPHA)',     // Pink
            'rgba(33, 150, 243, ALPHA)',    // Blue
            'rgba(255, 87, 34, ALPHA)',     // Orange
            'rgba(76, 175, 80, ALPHA)',     // Green
            'rgba(255, 255, 255, ALPHA)'    // White
        ];
        return colors[Math.floor(Math.random() * colors.length)].replace('ALPHA', this.alpha);
    }
    
    update(mouse) {
        // Oscillation movement
        this.oscillation += 0.02;
        this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
        this.y += this.speedY + Math.cos(this.oscillation) * 0.5;
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            this.size = this.originalSize * 2.5;
            // Push particles away from mouse
            const force = (mouse.radius - distance) / mouse.radius;
            this.speedX = -dx * 0.02 * force;
            this.speedY = -dy * 0.02 * force;
        } else {
            this.size = this.originalSize;
        }
        
        // Bounce off walls with damping
        if (this.x <= 0 || this.x >= this.canvasWidth) {
            this.speedX *= -0.9;
            this.x = this.x <= 0 ? 1 : this.canvasWidth - 1;
        }
        if (this.y <= 0 || this.y >= this.canvasHeight) {
            this.speedY *= -0.9;
            this.y = this.y <= 0 ? 1 : this.canvasHeight - 1;
        }
        
        // Slow down over time
        this.speedX *= 0.995;
        this.speedY *= 0.995;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color.replace('rgba', 'rgb').replace(/,[^)]+\)/, ')');
        
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
    // Initialize enhanced particle system
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
});
