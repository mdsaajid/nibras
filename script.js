document.addEventListener("DOMContentLoaded", function() {

    // ---- OPTIMIZED PRELOADER ----
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);

    // ---- HEADER, LOGO, MOBILE NAV ----
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    document.getElementById('interactive-logo').addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('enlarged');
    });

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // ---- SMOOTH SCROLL & ACTIVE NAV LINK ----
    const sections = document.querySelectorAll('section[id]');
    function navHighlighter() {
      let scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 71;
        let sectionId = current.getAttribute('id');
        let navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
        if(navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
              navLink.parentElement.classList.add('active');
            } else {
              navLink.parentElement.classList.remove('active');
            }
        }
      });
    }
    window.addEventListener('scroll', navHighlighter);

    // ---- BACK-TO-TOP BUTTON ----
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    });

    // ---- SCROLL ANIMATIONS ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ---- DARK/LIGHT MODE TOGGLE ----
    const themeToggle = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') themeToggle.checked = true;
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // ---- FAQ ACCORDION ----
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        const trigger = () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            answer.style.maxHeight = question.classList.contains('active') ? answer.scrollHeight + 'px' : null;
        };
        question.addEventListener('click', trigger);
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
        });
    });
    
    // ---- CURRENT TIME IN FAQ ----
    const timeElement = document.getElementById('current-time');
    if(timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    }

    // --- EFFICIENT ANIMATION MANAGER ---
    const animationManager = {
        heroParticles: {
            canvas: document.getElementById('background-canvas'),
            ctx: null,
            particles: [],
            config: {
                density: 8000,
                size: { min: 1.5, max: 2.5 },
                color: 'rgba(173, 20, 87, 0.7)'
            }
        },
        trail: {
            canvas: document.getElementById('trail-canvas'),
            ctx: null,
            points: [],
            pointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            config: {
                pointsNumber: 40,
                widthFactor: 0.3,
                spring: 0.4,
                friction: 0.5
            }
        },

        init() {
            // Init Hero Particles
            if (this.heroParticles.canvas) {
                this.heroParticles.ctx = this.heroParticles.canvas.getContext('2d');
                this.heroParticles.canvas.width = window.innerWidth;
                this.heroParticles.canvas.height = window.innerHeight;
                this.createHeroParticles();
            }

            // Init Trail
            if (this.trail.canvas) {
                this.trail.ctx = this.trail.canvas.getContext('2d');
                this.trail.canvas.width = window.innerWidth;
                this.trail.canvas.height = window.innerHeight;
                this.createTrailPoints();
                window.addEventListener("mousemove", (e) => {
                    this.trail.pointer.x = e.clientX;
                    this.trail.pointer.y = e.clientY;
                });
            }
            
            window.addEventListener('resize', () => this.handleResize());
            this.animate();
        },
        
        createHeroParticles() {
            this.heroParticles.particles = [];
            const { canvas, config } = this.heroParticles;
            let count = (canvas.height * canvas.width) / config.density;
            for (let i = 0; i < count; i++) {
                let size = (Math.random() * config.size.max) + config.size.min;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() * 0.3) - 0.15;
                let dy = (Math.random() * 0.3) - 0.15;
                this.heroParticles.particles.push({x, y, dx, dy, size, color: config.color});
            }
        },
        
        createTrailPoints() {
            this.trail.points = [];
            for (let i = 0; i < this.trail.config.pointsNumber; i++) {
                this.trail.points.push({
                    x: this.trail.pointer.x, y: this.trail.pointer.y,
                    vx: 0, vy: 0, index: i
                });
            }
        },

        handleResize() {
            if (this.heroParticles.canvas) {
                this.heroParticles.canvas.width = window.innerWidth;
                this.heroParticles.canvas.height = window.innerHeight;
                this.createHeroParticles();
            }
            if (this.trail.canvas) {
                this.trail.canvas.width = window.innerWidth;
                this.trail.canvas.height = window.innerHeight;
            }
        },

        animate() {
            // Animate Hero Particles
            if (this.heroParticles.ctx) {
                const { ctx, particles, canvas } = this.heroParticles;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    if (p.x > canvas.width || p.x < 0) p.dx = -p.dx;
                    if (p.y > canvas.height || p.y < 0) p.dy = -p.dy;
                    p.x += p.dx; p.y += p.dy;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color; ctx.fill();
                });
            }

            // Animate Trail
            if (this.trail.ctx) {
                const { ctx, points, config, pointer, canvas } = this.trail;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                points.forEach((p, i) => {
                    let prev = i > 0 ? points[i - 1] : pointer;
                    p.vx += (prev.x - p.x) * config.spring;
                    p.vy += (prev.y - p.y) * config.spring;
                    p.vx *= config.friction;
                    p.vy *= config.friction;
                    p.x += p.vx;
                    p.y += p.vy;
                });

                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length - 2; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }
                ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
                ctx.lineWidth = config.widthFactor * 5;
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#AD1457');
                gradient.addColorStop(1, '#E91E63');
                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
            
            requestAnimationFrame(() => this.animate());
        }
    };
    
    animationManager.init();
});
