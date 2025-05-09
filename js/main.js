/**
 * Game Mechanics 333 - Main JavaScript
 * This file contains all the interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything when DOM is fully loaded
    initNavigation();
    initAnimations();
    initContactForm();
});

/**
 * Mobile navigation functionality
 */
function initNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const closeMenuButton = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && closeMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
        
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Set active nav link based on scroll position
    const setActiveNavLink = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            
            if (window.pageYOffset >= sectionTop - navbarHeight - 100 && 
                window.pageYOffset < sectionTop + sectionHeight - navbarHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('load', setActiveNavLink);
}

/**
 * Animation triggers on scroll
 */
function initAnimations() {
    const elementsToAnimate = () => {
        const animationGroups = [
            { selector: '.game-card', delay: 120 },
            { selector: '.tech-card', delay: 120 },
            { selector: '.feature-card', delay: 120 },
            { selector: '.stat-item', delay: 150 },
            { selector: '.contact-form', delay: 0 },
            { selector: '.about-image', delay: 0 },
            { selector: '.about-text', delay: 200 }
        ];
        
        const triggerAnimation = (elements, delay = 0) => {
            elements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                
                if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                    setTimeout(() => {
                        element.classList.add('animate');
                        
                        // If element has a stat number, trigger count animation
                        if (element.classList.contains('stat-item')) {
                            const statNumber = element.querySelector('.stat-number');
                            if (statNumber && !statNumber.classList.contains('counted')) {
                                animateCounter(statNumber);
                                statNumber.classList.add('counted');
                            }
                        }
                    }, delay * index);
                }
            });
        };
        
        // Process each group of elements
        animationGroups.forEach(group => {
            const elements = document.querySelectorAll(group.selector);
            if (elements.length > 0) {
                triggerAnimation(elements, group.delay);
            }
        });
    };
    
    // Animate counting for statistics
    function animateCounter(statNumber) {
        const finalValue = parseInt(statNumber.getAttribute('data-value') || statNumber.textContent);
        let startValue = 0;
        const duration = 2000;
        const step = Math.ceil(finalValue / (duration / 16)); // 60fps approx
        
        statNumber.textContent = '0'; // Start from zero
        
        let counting = setInterval(() => {
            startValue += step;
            if (startValue > finalValue) {
                startValue = finalValue;
                clearInterval(counting);
            }
            statNumber.textContent = startValue;
        }, 16);
    }
    
    // Run animation check on scroll and initial load
    window.addEventListener('scroll', elementsToAnimate);
    window.addEventListener('load', () => {
        // Slight delay to ensure page is fully loaded
        setTimeout(elementsToAnimate, 300);
    });
}

/**
 * Contact form validation with animation
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Remove previous error messages
            document.querySelectorAll('.error-message').forEach(error => error.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission with animation
                const submitButton = contactForm.querySelector('.submit-button');
                submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitButton.style.backgroundColor = 'var(--success)';
                    
                    setTimeout(() => {
                        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                        submitButton.style.backgroundColor = '';
                        submitButton.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '4px';
        errorElement.style.transform = 'translateY(-10px)';
        errorElement.style.opacity = '0';
        errorElement.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        input.parentNode.appendChild(errorElement);
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Trigger animation
        setTimeout(() => {
            errorElement.style.transform = 'translateY(0)';
            errorElement.style.opacity = '1';
        }, 10);
        
        input.addEventListener('input', () => {
            errorElement.style.transform = 'translateY(-10px)';
            errorElement.style.opacity = '0';
            input.style.borderColor = '';
            input.style.boxShadow = '';
            
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.parentNode.removeChild(errorElement);
                }
            }, 300);
        }, { once: true });
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

// Gallery functionality for student game pages
function initGallery() {
    const modal = document.getElementById("imageModal");
    if (!modal) return;
    
    const modalImg = document.getElementById("expandedImg");
    const closeModal = document.getElementsByClassName("close-modal")[0];
    const galleryItems = document.querySelectorAll(".gallery-item img");
    
    galleryItems.forEach(item => {
        item.addEventListener("click", function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });
    
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });
    
    // Close modal when clicking outside of the image
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Execute for student game pages
if (document.querySelector('.gallery-item')) {
    initGallery();
}

// Initialize any game-specific functionality
function initGameSpecific() {
    // Gravity shift demo
    const gravityObject = document.getElementById("gravityObject");
    if (gravityObject) {
        const gravityButtons = document.querySelectorAll(".gravity-button");
        
        gravityButtons.forEach(button => {
            button.addEventListener("click", function() {
                const direction = this.getAttribute("data-direction");
                
                // Reset any existing animations
                gravityObject.style.animation = "none";
                gravityObject.offsetHeight; // Trigger reflow
                
                switch(direction) {
                    case "up":
                        gravityObject.style.top = "20%";
                        break;
                    case "down":
                        gravityObject.style.top = "80%";
                        break;
                    case "left":
                        gravityObject.style.left = "20%";
                        break;
                    case "right":
                        gravityObject.style.left = "80%";
                        break;
                    case "center":
                        gravityObject.style.top = "50%";
                        gravityObject.style.left = "50%";
                        gravityObject.style.animation = "float 3s ease-in-out infinite";
                        break;
                }
            });
        });
        
        // Initialize with floating animation
        gravityObject.style.animation = "float 3s ease-in-out infinite";
    }
}

// Execute game-specific code
if (document.querySelector('.gravity-demo') || document.querySelector('.game-specific-element')) {
    initGameSpecific();
}

// Preload animations to avoid flashes
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);
});