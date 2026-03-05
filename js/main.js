// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
};
animateFollower();

document.querySelectorAll('a, button, .skill__tag, .project-card, .stat-item, .timeline__content').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        cursorFollower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        cursorFollower.classList.remove('cursor--hover');
    });
});

// ===== SCROLL PROGRESS =====
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
});

// ===== TYPING EFFECT =====
const setupTypingEffect = () => {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;
    const texts = [
        'Pentester e Ingeniero de Sistemas',
        'Especialista en Ciberseguridad',
        'Hacker Ético Certificado',
        'Red Team & Vulnerability Research'
    ];
    let textIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
        const currentText = texts[textIndex];
        subtitle.textContent = isDeleting
            ? currentText.substring(0, charIndex - 1)
            : currentText.substring(0, charIndex + 1);
        isDeleting ? charIndex-- : charIndex++;

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            return setTimeout(type, 2000);
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            return setTimeout(type, 500);
        }
        setTimeout(type, isDeleting ? 40 : 80);
    };
    type();
};

// ===== PARTICLES =====
const createParticles = () => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;width:${Math.random()>.5?2:1}px;height:${Math.random()>.5?2:1}px;background:rgba(0,255,136,${0.1+Math.random()*0.3});border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:float-particle ${12+Math.random()*18}s linear infinite;animation-delay:${Math.random()*8}s;`;
        container.appendChild(p);
    }
    document.body.appendChild(container);
    const s = document.createElement('style');
    s.textContent = `@keyframes float-particle{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) translateX(80px);opacity:0}}`;
    document.head.appendChild(s);
};

// ===== 3D CARD TILT =====
const setupCardEffects = () => {
    document.querySelectorAll('.project-card, .skills__category, .stat-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const cx = rect.width / 2, cy = rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${(y-cy)/18}deg) rotateY(${(cx-x)/18}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
};

// ===== STATS COUNTER =====
const setupStatsCounter = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-item__number').forEach(el => {
                const target = parseInt(el.dataset.target);
                const start = performance.now();
                const update = (now) => {
                    const p = Math.min((now - start) / 1800, 1);
                    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
                    if (p < 1) requestAnimationFrame(update);
                    else el.textContent = target;
                };
                requestAnimationFrame(update);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    const s = document.querySelector('.stats');
    if (s) observer.observe(s);
};

// ===== TIMELINE ANIMATION =====
const setupTimeline = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('visible'), i * 200);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.timeline__item').forEach(item => observer.observe(item));
};

// ===== SKILL BARS =====
const setupSkillBars = () => {
    document.querySelectorAll('.skill__progress').forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0';
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.skill__progress').forEach(bar => {
                setTimeout(() => { bar.style.width = bar.getAttribute('data-width'); }, 200);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skills__category').forEach(c => observer.observe(c));
};

// ===== SCROLL SPY =====
const setupScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    });
};

// ===== MOBILE MENU =====
const setupMobileMenu = () => {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.querySelector('i').className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.querySelector('i').className = 'fas fa-bars';
        });
    });
};

// ===== SCROLL TOP =====
const setupScrollTop = () => {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.style.display = window.scrollY > 500 ? 'flex' : 'none'; });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ===== CONTACT FORM =====
const setupForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = '✓ Mensaje Enviado';
            form.reset();
            setTimeout(() => { btn.textContent = 'Enviar Mensaje'; btn.disabled = false; }, 3000);
        }, 1500);
    });
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setupTypingEffect();
    createParticles();
    setupCardEffects();
    setupStatsCounter();
    setupTimeline();
    setupSkillBars();
    setupScrollSpy();
    setupMobileMenu();
    setupScrollTop();
    setupForm();
});