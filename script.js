// DOM elementlarini bir marta olish
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const callButton = document.querySelector('.call-button');
const logo = document.querySelector('.logo-text');
const footerLogo = document.querySelector('.footer-logo .logo-text');
const yearElement = document.querySelector('.footer-bottom p');

// Mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu on link click
if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectElement = this.querySelector('.form-select');
        const isClubApplication = selectElement?.value === 'club';
        
        const message = isClubApplication 
            ? 'Tabriklaymiz! Yopiq ustalar klubiga a\'zo bo\'lish so\'rovingiz qabul qilindi. Tez orada siz bilan bog\'lanib, klub shartlari bilan tanishtiramiz.'
            : 'Xabaringiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.';
        
        alert(message);
        this.reset();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll(
    '.material-card, .guarantee-card, .feature, .commitment-item, ' +
    '.club-benefit, .contact-info, .contact-form, .statement-box, .value-item, .about-image'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    animationObserver.observe(el);
});

// Dynamic year
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
}

// Copy phone numbers
document.querySelectorAll('.big-phone, .footer-phone, .contact-phone').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const phoneMatch = this.textContent.match(/\+998[\s-]*\d{2}[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/);
        
        if (phoneMatch) {
            const phoneNumber = phoneMatch[0].replace(/[\s-]/g, '');
            
            navigator.clipboard.writeText(phoneNumber).then(() => {
                showTooltip('✓ Raqam nusxalandi!');
            });
        }
    });
});

// Tooltip helper
function showTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-blue);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        z-index: 9999;
        animation: fadeOut 2s forwards;
        font-size: 1.1rem;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
}

// Counter animation
function animateCounters() {
    document.querySelectorAll('.benefit-percent').forEach(counter => {
        const target = parseInt(counter.innerText);
        let count = 0;
        
        const updateCounter = () => {
            if (count < target) {
                count++;
                counter.innerText = count;
                setTimeout(updateCounter, 50);
            }
        };
        updateCounter();
    });
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
});

const benefitsSection = document.querySelector('.masters-benefits');
if (benefitsSection) {
    counterObserver.observe(benefitsSection);
}

// Scroll handlers with debounce
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const scrolled = window.scrollY > 100;
    navbar.style.background = scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--white)';
    navbar.style.backdropFilter = scrolled ? 'blur(10px)' : 'none';
    navbar.style.boxShadow = scrolled ? '0 5px 20px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.1)';
    
    // Update active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navbarHeight = navbar.offsetHeight;
    
    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', debounce(updateNavbar, 100));

// Call button animation
if (callButton) {
    let pulseInterval = setInterval(() => {
        callButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            callButton.style.transform = 'scale(1)';
        }, 200);
    }, 5000);

    callButton.addEventListener('mouseenter', () => {
        clearInterval(pulseInterval);
        callButton.style.animation = 'none';
    });

    callButton.addEventListener('mouseleave', () => {
        pulseInterval = setInterval(() => {
            callButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                callButton.style.transform = 'scale(1)';
            }, 200);
        }, 5000);
    });
}

// Form input animations
document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select').forEach(field => {
    const form = field.closest('.contact-form');
    if (!form) return;
    
    field.addEventListener('focus', () => {
        form.style.transform = 'scale(1.02)';
        form.style.boxShadow = '0 20px 40px rgba(1, 0, 226, 0.15)';
    });
    
    field.addEventListener('blur', () => {
        form.style.transform = 'scale(1)';
        form.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    });
});

// Glitch effect on logo
if (logo) {
    logo.addEventListener('mouseenter', () => {
        logo.style.animation = 'glitch 0.5s infinite';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.animation = 'none';
    });
}

// Phone number formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (!value) return;
        
        // Format: +998 XX XXX XX XX
        const parts = [
            value.slice(0, 3),
            value.slice(3, 5),
            value.slice(5, 8),
            value.slice(8, 10),
            value.slice(10, 12)
        ].filter(p => p);
        
        this.value = '+' + parts.join(' ');
    });
});

// Scroll to top
if (footerLogo) {
    footerLogo.style.cursor = 'pointer';
    footerLogo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 MEGAMIR v2.0', 'background: #0100E2; color: white; font-size: 20px; padding: 10px; border-radius: 10px;');
    document.body.classList.add('loaded');
    
    // Add fadeOut animation
    if (!document.querySelector('#fadeOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeOutStyle';
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
});