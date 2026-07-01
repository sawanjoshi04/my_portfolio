document.addEventListener('DOMContentLoaded', () => {

    // 1. Bottom skills minimal animation on load
    setTimeout(() => {
        document.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 500);

    // Pillar smooth translateY animation + drag with momentum
    let justDragged = false;
    const pillarScroll = document.querySelector('.pillar-scroll-container');
    if (pillarScroll) {
        let posY = 0;
        let speed = -0.3;       // default: scroll up
        let targetSpeed = -0.3;
        let active = true;
        let dragStartY = 0, dragStartPos = 0, dragging = false;
        let dragSpeed = 0, lastDelta = 0, decelSteps = 0;
        const halfHeight = pillarScroll.scrollHeight / 2;
        const DECEL_FRAMES = 360; // ~6 sec smooth brake

        function animate() {
            if (active) {
                if (decelSteps > 0) {
                    speed += (targetSpeed - speed) * 0.02;
                    decelSteps--;
                    if (decelSteps <= 0) speed = targetSpeed;
                }
                posY += speed;
                posY = ((posY % halfHeight) + halfHeight) % halfHeight - halfHeight;
            }
            pillarScroll.style.transform = `translateY(${posY}px)`;
            requestAnimationFrame(animate);
        }
        posY = -halfHeight / 2;
        animate();

        pillarScroll.addEventListener('mousedown', (e) => {
            active = false;
            dragging = true;
            decelSteps = 0;
            dragStartY = e.clientY;
            dragStartPos = posY;
            dragSpeed = speed;
            pillarScroll.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            lastDelta = (e.clientY - dragStartY) * 1.2;
            posY = dragStartPos + lastDelta;
            // record momentum
            if (lastDelta < -3) dragSpeed = -3;
            else if (lastDelta > 3) dragSpeed = 3;
            pillarScroll.style.transform = `translateY(${posY}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            pillarScroll.style.cursor = '';
            justDragged = true;
            setTimeout(() => justDragged = false, 300);
            speed = dragSpeed;
            targetSpeed = lastDelta < -2 ? -0.3 : (lastDelta > 2 ? 0.3 : -0.3);
            decelSteps = DECEL_FRAMES;
            active = true;
        });

        // Touch events for phone
        pillarScroll.addEventListener('touchstart', (e) => {
            active = false;
            dragging = true;
            decelSteps = 0;
            dragStartY = e.touches[0].clientY;
            dragStartPos = posY;
            dragSpeed = speed;
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            lastDelta = (e.touches[0].clientY - dragStartY) * 1.2;
            posY = dragStartPos + lastDelta;
            if (lastDelta < -3) dragSpeed = -3;
            else if (lastDelta > 3) dragSpeed = 3;
            pillarScroll.style.transform = `translateY(${posY}px)`;
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (!dragging) return;
            dragging = false;
            justDragged = true;
            setTimeout(() => justDragged = false, 300);
            speed = dragSpeed;
            targetSpeed = lastDelta < -2 ? -0.3 : (lastDelta > 2 ? 0.3 : -0.3);
            decelSteps = DECEL_FRAMES;
            active = true;
        });
    } 

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

    // Mobile Pillar toggle - trigger tab
    const pillarTrigger = document.getElementById('pillar-trigger');
    const rightPillar = document.getElementById('infoPillar');
    if (pillarTrigger && rightPillar) {
        pillarTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            rightPillar.classList.toggle('open');
            pillarTrigger.classList.toggle('hidden', rightPillar.classList.contains('open'));
        });
    }
    // Click outside pillar to close
    document.addEventListener('click', (e) => {
        if (rightPillar && rightPillar.classList.contains('open')) {
            if (justDragged) return;
            if (!rightPillar.contains(e.target) && e.target !== pillarTrigger) {
                rightPillar.classList.remove('open');
                pillarTrigger.classList.remove('hidden');
            }
        }
    });
    // Mobile Navbar toggle
    const navToggleBtn = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.navbar-upgraded .nav-links');
    if (navToggleBtn && navLinks) {
        navToggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }
    
});
