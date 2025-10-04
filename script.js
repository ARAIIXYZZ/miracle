// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 80;
        this.mouse = {
            x: 0,
            y: 0,
            radius: 100
        };
        
        this.init();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e));
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
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse);
            this.particles[i].draw(this.ctx);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.5 + 0.2;
        this.originalSize = this.size;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(103, 58, 183, ALPHA)', // Purple
            'rgba(233, 30, 99, ALPHA)',  // Pink
            'rgba(33, 150, 243, ALPHA)', // Blue
            'rgba(255, 255, 255, ALPHA)' // White
        ];
        return colors[Math.floor(Math.random() * colors.length)].replace('ALPHA', this.alpha);
    }
    
    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            this.size = this.originalSize * 2;
            // Push particles away from mouse
            this.speedX = -dx * 0.05;
            this.speedY = -dy * 0.05;
        } else {
            this.size = this.originalSize;
        }
        
        // Bounce off walls
        if (this.x <= 0 || this.x >= this.canvasWidth) this.speedX *= -1;
        if (this.y <= 0 || this.y >= this.canvasHeight) this.speedY *= -1;
        
        // Slow down over time
        this.speedX *= 0.99;
        this.speedY *= 0.99;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color.replace('rgba', 'rgb').replace(/,[^)]+\)/, ')');
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
    // Initialize particle system
    new ParticleSystem();
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 0;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Text animation
    const mainName = document.querySelector('.main-name');
    const originalText = mainName.textContent;
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add subtle floating animation to main content
    const mainContent = document.querySelector('.main-content');
    let floatValue = 0;
    
    function floatAnimation() {
        floatValue += 0.01;
        const floatY = Math.sin(floatValue) * 3;
        mainContent.style.transform = `translateY(${floatY}px)`;
        requestAnimationFrame(floatAnimation);
    }
    
    floatAnimation();
});
