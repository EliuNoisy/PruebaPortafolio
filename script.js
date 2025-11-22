/* CONFIGURACION PRINCIPAL - CAMBIA TU ITSON ID AQUI */
const ITSON_ID = '252028';
const API_BASE = 'https://portfolio-api-three-black.vercel.app/api/v1';

/* INICIALIZACION AL CARGAR LA PAGINA */
document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initNavigation();
    initTypingEffect();
    loadProjects();
    animateCounters();
    animateSkillBars();
    initSmoothScroll();
});

/* INICIALIZAR ANIMACIONES AOS */
function initAOS() {
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        delay: 100
    });
}

/* NAVEGACION */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveLink();
    });
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* ACTUALIZAR LINK ACTIVO EN NAVEGACION */
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* EFECTO DE ESCRITURA EN HERO */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const words = [
        'Desarrollador Full Stack',
        'Diseñador UI/UX',
        'Programador Frontend',
        'Arquitecto Backend',
        'Creador de Soluciones'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

/* ANIMACION DE CONTADORES */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                const updateCount = () => {
                    const count = parseInt(counter.textContent);
                    const increment = target / speed;
                    
                    if (count < target) {
                        counter.textContent = Math.ceil(count + increment);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/* ANIMACION DE BARRAS DE HABILIDADES */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-3d');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

/* CARGAR PROYECTOS DESDE LA API */
async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const statNumber = document.querySelector('.stat-number[data-target="0"]');
    
    try {
        console.log(`Cargando proyectos para ITSON ID: ${ITSON_ID}`);
        
        const response = await fetch(`${API_BASE}/publicProjects/${ITSON_ID}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const projects = await response.json();
        
        console.log('Proyectos cargados:', projects);
        
        if (statNumber && projects.length > 0) {
            statNumber.setAttribute('data-target', projects.length);
        }
        
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No hay proyectos publicos aun</h3>
                    <p>Los proyectos se mostraran aqui una vez que sean agregados desde el backoffice.</p>
                    <p style="font-size: 1rem; margin-top: 20px; opacity: 0.7;">
                        ITSON ID configurado: <strong>${ITSON_ID}</strong>
                    </p>
                </div>
            `;
            return;
        }
        
        renderProjects(projects);
        
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar proyectos</h3>
                <p>${error.message}</p>
                <p style="font-size: 1rem; margin-top: 20px; opacity: 0.7;">
                    Verifica que tu ITSON ID (<strong>${ITSON_ID}</strong>) sea correcto<br>
                    y que tengas proyectos publicos en el backoffice.
                </p>
            </div>
        `;
    }
}

/* RENDERIZAR PROYECTOS EN LA INTERFAZ */
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    projectsGrid.innerHTML = projects.map((project, index) => {
        const delay = index * 100;
        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0] 
            : 'https://via.placeholder.com/400x280/667eea/ffffff?text=Proyecto';
        
        return `
            <div class="project-card-3d" data-aos="fade-up" data-aos-delay="${delay}">
                <img src="${escapeHtml(imageUrl)}" 
                     alt="${escapeHtml(project.title)}" 
                     class="project-image-3d"
                     onerror="this.src='https://via.placeholder.com/400x280/667eea/ffffff?text=Proyecto'">
                
                <div class="project-content-3d">
                    <h3 class="project-title-3d">${escapeHtml(project.title)}</h3>
                    
                    <p class="project-description-3d">${escapeHtml(project.description)}</p>
                    
                    ${project.technologies && project.technologies.length > 0 ? `
                        <div class="project-technologies-3d">
                            ${project.technologies.map(tech => 
                                `<span class="tech-badge-3d">${escapeHtml(tech)}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="project-links-3d">
                        ${project.repository ? `
                            <a href="${escapeHtml(project.repository)}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="project-link-3d">
                                <i class="fab fa-github"></i>
                                <span>Codigo</span>
                            </a>
                        ` : ''}
                        ${project.liveUrl ? `
                            <a href="${escapeHtml(project.liveUrl)}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="project-link-3d">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Demo</span>
                            </a>
                        ` : ''}
                        ${!project.repository && !project.liveUrl ? `
                            <span class="project-link-3d" style="cursor: default; opacity: 0.6;">
                                <i class="fas fa-info-circle"></i>
                                <span>Proyecto</span>
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    AOS.refresh();
}

/* ESCAPAR HTML PARA PREVENIR XSS */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* SCROLL SUAVE PARA TODOS LOS ENLACES */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* MENSAJE EN CONSOLA */
console.log('%c¡Hola Desarrollador! 👋', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cGracias por visitar mi portafolio', 'font-size: 16px; color: #f093fb;');
console.log('%cSi estas interesado en trabajar juntos, ¡contactame!', 'font-size: 14px; color: #4facfe;');
console.log('%c\nPortafolio desarrollado con:', 'font-size: 12px; font-weight: bold;');
console.log('- HTML5 & CSS3 (Glassmorphism 3D)');
console.log('- JavaScript Vanilla (ES6+)');
console.log('- AOS (Animate On Scroll)');
console.log('- API REST personalizada');

/* DETECTAR MODO OSCURO DEL SISTEMA */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('%c✓ Modo oscuro detectado', 'color: #a855f7;');
}

/* PERFORMANCE MONITORING */
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%c⚡ Pagina cargada en ${Math.round(loadTime)}ms`, 'color: #4facfe; font-weight: bold;');
});