document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    // --- PARTICLES.JS CONFIGURATION ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#003366', '#007acc', '#0066aa']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#007acc',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // --- HEADER SCROLL EFFECT ---
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- MOBILE NAVIGATION ---
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // --- BACK TO TOP BUTTON ---
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- SCROLLSPY FOR NAVIGATION HIGHLIGHTING ---
    const sections = document.querySelectorAll('main section[id]');
    const navA = document.querySelectorAll('.nav-links a');
    const headerHeight = header ? header.offsetHeight : 70;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 20;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navA.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const elementsToFade = document.querySelectorAll('.fade-in');
    elementsToFade.forEach((el, index) => {
        el.style.setProperty('--i', index);
        observer.observe(el);
    });

    // --- EMAIL COPY FUNCTIONALITY ---
    document.querySelectorAll('.copy-email').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(link.textContent).then(() => {
                const originalTitle = link.title;
                link.title = 'Copied!';
                setTimeout(() => { link.title = originalTitle; }, 2000);
            }).catch(err => console.error('Failed to copy email: ', err));
        });
    });

    // --- COPY VENUE ADDRESS ---
    const copyAddressBtn = document.getElementById('copy-address-btn');
    if (copyAddressBtn) {
        const venueAddress = 'AAU Innovate, Thomas Manns Vej 25, 9220 Aalborg Ø, Denmark';
        copyAddressBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(venueAddress);
                const originalLabel = copyAddressBtn.textContent;
                copyAddressBtn.textContent = 'Address copied!';
                copyAddressBtn.disabled = true;
                setTimeout(() => {
                    copyAddressBtn.textContent = originalLabel;
                    copyAddressBtn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('Failed to copy address:', error);
                copyAddressBtn.textContent = 'Copy not available';
                setTimeout(() => { copyAddressBtn.textContent = 'Copy address'; }, 2000);
            }
        });
    }

});
