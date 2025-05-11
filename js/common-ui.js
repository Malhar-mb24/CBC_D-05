/**
 * Common UI Components for Kisan Sathi
 * Handles shared UI elements like header, footer, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing common UI components...');
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Add scroll effects
    initScrollEffects();
    
    // Initialize tooltips
    initTooltips();
    
    // Add hover animations to cards and buttons
    initHoverEffects();
    
    console.log('Common UI components initialized successfully');
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.ks-menu-toggle');
    const navLinks = document.querySelector('.ks-nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Toggle between hamburger and close icon
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.ks-nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

/**
 * Initialize scroll effects for elements
 */
function initScrollEffects() {
    // Add shadow to header on scroll
    const header = document.querySelector('.ks-header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.style.boxShadow = 'var(--shadow-lg)';
            header.style.background = 'var(--primary-dark)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
            header.style.background = 'var(--gradient-primary)';
        }
    });
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.ks-reveal');
    
    if (revealElements.length > 0) {
        const revealOnScroll = function() {
            for (let i = 0; i < revealElements.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = revealElements[i].getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {
                    revealElements[i].classList.add('active');
                }
            }
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Check on page load
    }
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        const tooltipText = tooltip.getAttribute('data-tooltip');
        
        // Create tooltip element
        const tooltipElement = document.createElement('span');
        tooltipElement.className = 'ks-tooltip-text';
        tooltipElement.textContent = tooltipText;
        
        // Add tooltip class to parent
        tooltip.classList.add('ks-tooltip');
        
        // Append tooltip element
        tooltip.appendChild(tooltipElement);
    });
}

/**
 * Initialize hover effects for cards and buttons
 */
function initHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.ks-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.ks-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ks-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Create a notification toast
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.ks-notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'ks-notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `ks-notification ks-notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // Set content
    notification.innerHTML = `
        <div class="ks-notification-icon">${icon}</div>
        <div class="ks-notification-message">${message}</div>
        <button class="ks-notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.ks-notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after duration
    setTimeout(() => {
        closeNotification(notification);
    }, duration);
}

/**
 * Close a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('active');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

/**
 * Add a loading spinner to an element
 * @param {HTMLElement} element - The element to add the spinner to
 * @param {string} size - Size of the spinner (small, medium, large)
 */
function addLoadingSpinner(element, size = 'medium') {
    // Store original content
    element.dataset.originalContent = element.innerHTML;
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = `ks-loading-spinner ks-spinner-${size}`;
    
    // Clear and add spinner
    element.innerHTML = '';
    element.appendChild(spinner);
    element.classList.add('ks-loading');
    
    return {
        // Method to remove spinner and restore content
        remove: function() {
            element.innerHTML = element.dataset.originalContent;
            element.classList.remove('ks-loading');
        }
    };
}

// Export functions for global use
window.KS = window.KS || {};
window.KS.UI = {
    showNotification,
    addLoadingSpinner
};
