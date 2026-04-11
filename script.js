document.addEventListener('DOMContentLoaded', () => {

    // 1. Bottom skills minimal animation on load
    setTimeout(() => {
        document.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 500);

    // CSS handles the 30s infinite scroll now natively. 

    // 3. Canvas Background - Exactly 3 to 4 floating dots
    const canvas = document.getElementById('dotsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Dot {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // very gentle drift
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1.5;
        }
        update() {
            this.x += this.vx; 
            this.y += this.vy;
            // soft bounce boundaries
            if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(74, 184, 255, 0.5)'; // Matches #4AB8FF accents
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fill();
        }
    }

    const dots = [];
    // Creating exactly 4 dots for an ultra minimal feel
    for(let i=0; i < 4; i++) {
        dots.push(new Dot()); 
    }

    function animDots() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        dots.forEach(d => { 
            d.update(); 
            d.draw(); 
        });
        requestAnimationFrame(animDots);
    }
    animDots();
    
});
