/*=============== VARIABLES GLOBALES ===============*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');

/*=============== MENÚ MÓVIL ===============*/
// Mostrar/ocultar menú
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
        
        // Cambiar icono del toggle
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('show-menu')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

/*=============== HEADER SCROLL ===============*/
function scrollHeader() {
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

/*=============== NAVEGACIÓN ACTIVA ===============*/
function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionsClass?.classList.add('active-link');
        } else {
            sectionsClass?.classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);

/*=============== SCROLL SUAVE ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*=============== ANIMACIONES DE SCROLL ===============*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(`
        .proyecto__card,
        .tecnicas__card,
        .beneficios__social-card,
        .ubicacion__card,
        .contacto__card,
        .galeria__item
    `);
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
});

/*=============== GALERÍA MODAL ===============*/
class GaleriaModal {
    constructor() {
        this.modal = document.getElementById('galeria-modal');
        this.modalImg = document.getElementById('galeria-modal-img');
        this.closeBtn = document.querySelector('.galeria__modal-close');
        this.prevBtn = document.getElementById('galeria-prev');
        this.nextBtn = document.getElementById('galeria-next');
        this.galeriaItems = document.querySelectorAll('.galeria__item');
        this.currentIndex = 0;
        this.images = [];
        
        this.init();
    }
    
    init() {
        // Recopilar todas las imágenes
        this.galeriaItems.forEach((item, index) => {
            const imgSrc = item.getAttribute('data-src');
            const imgAlt = item.querySelector('img').getAttribute('alt');
            this.images.push({ src: imgSrc, alt: imgAlt });
            
            // Agregar evento click
            item.addEventListener('click', () => {
                this.openModal(index);
            });
        });
        
        // Eventos del modal
        this.closeBtn?.addEventListener('click', () => this.closeModal());
        this.prevBtn?.addEventListener('click', () => this.prevImage());
        this.nextBtn?.addEventListener('click', () => this.nextImage());
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
            if (e.key === 'ArrowLeft' && this.modal.classList.contains('show')) {
                this.prevImage();
            }
            if (e.key === 'ArrowRight' && this.modal.classList.contains('show')) {
                this.nextImage();
            }
        });
        
        // Cerrar al hacer click fuera de la imagen
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
    
    openModal(index) {
        this.currentIndex = index;
        this.showImage();
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    showImage() {
        const image = this.images[this.currentIndex];
        this.modalImg.src = image.src;
        this.modalImg.alt = image.alt;
    }
    
    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.showImage();
    }
    
    nextImage() {
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.showImage();
    }
}

/*=============== CONTADOR ANIMADO ===============*/
class ContadorAnimado {
    constructor() {
        this.contadores = document.querySelectorAll('.hero__stat-number, .tecnicas__card-number, .beneficios__env-number');
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.contadores.forEach(contador => {
            observer.observe(contador);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formatear número con separadores de miles
            const formattedNumber = Math.floor(current).toLocaleString('es-AR');
            
            // Preservar texto adicional (como MW, %, etc.)
            const originalText = element.textContent;
            const numberPart = originalText.match(/[\d.,]+/);
            if (numberPart) {
                element.textContent = originalText.replace(numberPart[0], formattedNumber);
            } else {
                element.textContent = formattedNumber;
            }
        }, 16);
    }
}

/*=============== GOOGLE MAPS ===============*/
let map;
let marker;

function initMap() {
    // Coordenadas aproximadas de Villa Dolores, Córdoba
    const villaDoloRes = { lat: -31.9505, lng: -65.1936 };
    
    // Configuración del mapa
    const mapOptions = {
        zoom: 12,
        center: villaDoloRes,
        mapTypeId: 'hybrid',
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#2563eb' }]
            },
            {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }, { weight: 2 }]
            }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
    };
    
    // Crear el mapa
    const mapContainer = document.getElementById('mapa');
    if (mapContainer) {
        map = new google.maps.Map(mapContainer, mapOptions);
        
        // Crear marcador personalizado
        marker = new google.maps.Marker({
            position: villaDoloRes,
            map: map,
            title: 'Parque Solar Papa Francisco - CEMDO',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        <circle cx="12" cy="12" r="3" fill="#2563eb"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
            },
            animation: google.maps.Animation.DROP
        });
        
        // Ventana de información
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 300px;">
                    <h3 style="color: #2563eb; margin: 0 0 10px 0;">Parque Solar Papa Francisco</h3>
                    <p style="margin: 0 0 5px 0;"><strong>Ubicación:</strong> RP 148, Villa Dolores, Córdoba</p>
                    <p style="margin: 0 0 5px 0;"><strong>Superficie:</strong> 22,5 hectáreas</p>
                    <p style="margin: 0 0 5px 0;"><strong>Potencia:</strong> 10 MW AC</p>
                    <p style="margin: 0;"><strong>Cooperativa:</strong> CEMDO Ltda</p>
                </div>
            `
        });
        
        // Mostrar info al hacer click en el marcador
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        // Abrir info window por defecto
        setTimeout(() => {
            infoWindow.open(map, marker);
        }, 1000);
        
    } else {
        // Fallback si no se puede cargar Google Maps
        console.warn('No se pudo cargar Google Maps. Mostrando mensaje alternativo.');
        const mapContainer = document.getElementById('mapa');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #2563eb; margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 1rem;">Ubicación del Parque Solar</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>Dirección:</strong> RP 148, Villa Dolores, Córdoba</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Coordenadas:</strong> -31.9505° S, -65.1936° O</p>
                    <p><strong>Superficie:</strong> 22,5 hectáreas</p>
                </div>
            `;
        }
    }
}

// Función de fallback si Google Maps no se carga
window.gm_authFailure = function() {
    console.warn('Error de autenticación de Google Maps');
    initMap(); // Llamar al fallback
};

/*=============== EFECTOS DE HOVER Y INTERACCIÓN ===============*/
class EfectosInteraccion {
    constructor() {
        this.init();
    }
    
    init() {
        // Efecto parallax en hero
        this.initParallax();
        
        // Efecto de hover en cards
        this.initCardHovers();
        
        // Efecto de typing en el título
        this.initTypingEffect();
    }
    
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const heroVideo = document.querySelector('.hero__video');
            
            if (hero && heroVideo) {
                const rate = scrolled * -0.5;
                heroVideo.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    initCardHovers() {
        const cards = document.querySelectorAll(`
            .proyecto__card,
            .tecnicas__card,
            .beneficios__social-card,
            .ubicacion__card,
            .contacto__card
        `);
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    initTypingEffect() {
        const titleElement = document.querySelector('.hero__title-main');
        if (titleElement) {
            const originalText = titleElement.textContent;
            titleElement.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    titleElement.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Iniciar el efecto después de un breve delay
            setTimeout(typeWriter, 1000);
        }
    }
}

/*=============== LAZY LOADING DE IMÁGENES ===============*/
class LazyLoading {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin soporte
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

/*=============== FORMULARIO DE CONTACTO (si se agrega) ===============*/
class FormularioContacto {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Aquí se puede agregar la lógica para enviar el formulario
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        console.log('Datos del formulario:', data);
        
        // Mostrar mensaje de éxito
        this.showMessage('¡Mensaje enviado correctamente!', 'success');
        this.form.reset();
    }
    
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.textContent = message;
        
        this.form.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

/*=============== SCROLL TO TOP ===============*/
class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }
    
    createButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Volver arriba');
        
        // Estilos del botón
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.3s ease',
            opacity: '0',
            visibility: 'hidden',
            zIndex: '1000'
        });
        
        document.body.appendChild(button);
        return button;
    }
    
    init() {
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        });
        
        // Scroll suave al top
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Efectos hover
        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'translateY(-3px) scale(1.1)';
            this.button.style.backgroundColor = '#1d4ed8';
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'translateY(0) scale(1)';
            this.button.style.backgroundColor = '#2563eb';
        });
    }
}

/*=============== INICIALIZACIÓN ===============*/
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las clases
    new GaleriaModal();
    new ContadorAnimado();
    new EfectosInteraccion();
    new LazyLoading();
    new FormularioContacto();
    new ScrollToTop();
    
    // Preloader (opcional)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }
    
    console.log('🌞 Parque Solar Papa Francisco - Sitio web cargado correctamente');
});

/*=============== UTILIDADES ADICIONALES ===============*/

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para formatear números
function formatNumber(num) {
    return num.toLocaleString('es-AR');
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para copiar texto al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        return false;
    }
}

// Función para compartir en redes sociales
function shareOnSocial(platform, url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

/*=============== MANEJO DE ERRORES ===============*/
window.addEventListener('error', (e) => {
    console.error('Error en el sitio web:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});

/*=============== PERFORMANCE MONITORING ===============*/
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Tiempo de carga: ${Math.round(loadTime)}ms`);
    });
}

