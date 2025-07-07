document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const copyEmailLinks = document.querySelectorAll('.copy-email');
    
    // 1. Mobile Navigation Toggle
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple hamburger to X animation
        menuIcon.classList.toggle('active'); 
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('active');
            }
        });
    });
    
    // 2. Sticky Header & Back-to-Top Button
    window.addEventListener('scroll', () => {
        // Sticky header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 3. Back to Top Smooth Scroll
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Copy Email to Clipboard
    copyEmailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = link.textContent;
            const originalText = link.getAttribute('title');
            
            navigator.clipboard.writeText(email).then(() => {
                link.textContent = 'Copied!';
                link.style.color = '#28a745'; // Success color
                setTimeout(() => {
                    link.textContent = email;
                    link.style.color = ''; // Revert color
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                alert(`Could not copy email. Please copy it manually: ${email}`);
            });
        });
    });

    // 5. Active Nav Link on Scroll (Intersection Observer for performance)
    const sections = document.querySelectorAll('main section[id]');
    const navLi = document.querySelectorAll('header .nav-links li a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLi.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
        threshold: 0.4
    });

    sections.forEach(section => {
        observer.observe(section);
    });

});