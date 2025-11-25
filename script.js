// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        hamburger.style.position = 'fixed';
        navMenu.style.position = 'fixed';
        navMenu.style.top = '60px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.flexDirection = 'column';
        navMenu.style.backgroundColor = 'rgba(10, 14, 39, 0.98)';
        navMenu.style.zIndex = '999';
        navMenu.style.gap = '20px';
        navMenu.style.padding = '20px';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
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
            entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards, earn cards, FAQ items
document.querySelectorAll('.feature-card, .earn-card, .faq-item, .step').forEach(el => {
    observer.observe(el);
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Button interactions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
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
        navbar.style.borderBottomColor = 'rgba(51, 56, 126, 0.5)';
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
    } else {
        navbar.style.borderBottomColor = 'rgba(51, 56, 126, 0.2)';
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
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
                const text = el.textContent;
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
    if (e.key === 'Escape' && navMenu && navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    }
});

// Accessibility: Add focus visible styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    button:focus-visible,
    a:focus-visible {
        outline: 2px solid #00d4ff;
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
