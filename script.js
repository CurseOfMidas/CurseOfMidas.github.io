// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Detect system preference
const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Load saved theme from localStorage or use system preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || (systemPreference ? 'dark' : 'light');
    setTheme(savedTheme);
}

// Set theme
function setTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme === 'light' ? 'light-mode' : 'dark-mode');
    
    // Update theme toggle icon
    if (themeToggle) {
        if (theme === 'light') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    }
    
    // Update html attribute for CSS
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Theme toggle button click handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || (systemPreference ? 'dark' : 'light');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Load theme on page load
loadTheme();

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on a link or action
    document.querySelectorAll('.nav-link, .nav-btn').forEach(el => {
        el.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Scroll animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // add class-based reveal to avoid inline layout thrash
            window.requestAnimationFrame(() => entry.target.classList.add('in-view'));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards, earn cards, FAQ items
document.querySelectorAll('.feature-card, .earn-card, .faq-item, .step').forEach(el => {
    observer.observe(el);
});

// (Reveal animation handled by CSS class '.in-view')

// Button interactions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect (golden)
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 215, 0, 0.14)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to styles
// ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.borderBottomColor = 'rgba(255,215,0,0.08)';
        navbar.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.88), rgba(10,8,10,0.95))';
    } else {
        navbar.style.borderBottomColor = 'transparent';
        navbar.style.background = 'rgba(0,0,0,0.6)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let count = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('★')) {
            element.textContent = count.toFixed(1) + '★';
        } else if (element.textContent.includes('$')) {
            element.textContent = '$' + Math.floor(count) + 'M+';
        } else if (element.textContent.includes('K')) {
            element.textContent = Math.floor(count) + 'K+';
        } else if (element.textContent.includes('+')) {
            element.textContent = Math.floor(count) + '+';
        }
    }, 16);
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statElements = entry.target.querySelectorAll('.stat-number');
            statElements.forEach(el => {
                const text = el.textContent || '';
                // Skip counters for Early Access placeholders
                if (text.toLowerCase().includes('early') || text.trim() === '0' || text.trim() === '$0') return;
                let target = 0;
                
                if (text.includes('500K')) target = 500;
                else if (text.includes('50M')) target = 50;
                else if (text.includes('150')) target = 150;
                else if (text.includes('4.8')) target = 4.8;
                
                if (target) {
                    animateCounter(el, target);
                }
            });
            
            entry.target.dataset.animated = 'true';
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Accessibility: Add focus visible styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    button:focus-visible,
    a:focus-visible {
        outline: 2px solid rgba(255,215,0,0.9);
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);

// Add loading state to buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const originalText = this.textContent;
        
        // Optional: Add loading state
        // this.textContent = 'Processing...';
        // this.disabled = true;
        // 
        // setTimeout(() => {
        //     this.textContent = originalText;
        //     this.disabled = false;
        // }, 2000);
    });
});

console.log('Curse of Midas website loaded successfully!');
