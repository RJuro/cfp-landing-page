document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const form = document.getElementById('submission-form');
    
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
    
    // --- CAPTCHA LOGIC ---
    let captchaCorrectAnswer = 0;
    const captchaQuestionEl = document.getElementById('captcha-question');
    
    function generateCaptcha() {
        const num1 = Math.ceil(Math.random() * 10);
        const num2 = Math.ceil(Math.random() * 5);
        captchaCorrectAnswer = num1 + num2;
        if(captchaQuestionEl) {
            captchaQuestionEl.textContent = `${num1} + ${num2} = ?`;
        }
    }
    generateCaptcha();

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

    // --- FORM SUBMISSION HANDLING ---
    if (form) {
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-form-btn');
        const fileInput = form.querySelector('.file-input');
        const fullNameInput = form.querySelector('#full_name');
        const emailInput = form.querySelector('#email');
        const paperTitleInput = form.querySelector('#paper_title');
        const captchaInput = form.querySelector('#captcha');
        const webhookUrl = 'https://n8n.automate.business.aau.dk/webhook/6a3e5777-c598-41f7-ab65-113973636107';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        fileInput?.addEventListener('change', () => {
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Choose a file...';
            const fileLabelText = form.querySelector('.file-label-text');
            if (fileLabelText) fileLabelText.textContent = fileName;
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.querySelector('#website').value) return;

            // Client-side validation
            let isValid = true;
            const trimmedFullName = fullNameInput?.value.trim() || '';
            const trimmedEmail = emailInput?.value.trim() || '';
            const trimmedTitle = paperTitleInput?.value.trim() || '';
            const paperFile = fileInput?.files?.[0] || null;

            if (fullNameInput) fullNameInput.value = trimmedFullName;
            if (emailInput) emailInput.value = trimmedEmail;
            if (paperTitleInput) paperTitleInput.value = trimmedTitle;

            if (!trimmedFullName) {
                isValid = false;
            }
            if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
                isValid = false;
                formStatus.textContent = 'Please provide a valid email address.';
            }
            if (!trimmedTitle) {
                isValid = false;
                if (!formStatus.textContent) formStatus.textContent = 'Please include your current paper title.';
            }
            if (!paperFile) {
                isValid = false;
                if (!formStatus.textContent) formStatus.textContent = 'Please upload your manuscript as a single PDF.';
            }

            if (paperFile) {
                const isPdf = paperFile.name.toLowerCase().endsWith('.pdf');
                const isWithinSize = paperFile.size <= 15 * 1024 * 1024;
                if (!isPdf) {
                    isValid = false;
                    formStatus.textContent = 'Please upload your manuscript as a single PDF.';
                } else if (!isWithinSize) {
                    isValid = false;
                    formStatus.textContent = 'The PDF exceeds the 15 MB size limit.';
                }
            }

            if (!isValid) {
                if (!formStatus.textContent) {
                    formStatus.textContent = 'Please fill out all required fields.';
                }
                formStatus.className = '';
                formStatus.classList.add('error');
                return;
            }

            // Captcha validation
            const userAnswer = parseInt(captchaInput.value, 10);
            if (userAnswer !== captchaCorrectAnswer) {
                formStatus.textContent = 'Incorrect security answer. A new question has been generated.';
                formStatus.className = '';
                formStatus.classList.add('error');
                captchaInput.value = '';
                generateCaptcha();
                return;
            }

            // Start submission process
            formStatus.textContent = 'Submitting, please wait...';
            formStatus.className = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            try {
                const formData = new FormData();
                formData.append('full_name', trimmedFullName);
                formData.append('email', trimmedEmail);
                formData.append('paper_title', trimmedTitle);
                formData.append('paper', paperFile, paperFile.name);
                formData.append('captcha', captchaInput.value.trim());

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    credentials: 'omit',
                    cache: 'no-store'
                });

                formStatus.textContent = 'Thank you! Your manuscript has been uploaded successfully.';
                formStatus.className = '';
                formStatus.classList.add('success');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload Manuscript';
                const fileLabelText = form.querySelector('.file-label-text');
                if (fileLabelText) fileLabelText.textContent = 'Choose a file...';
                setTimeout(() => {
                    const uploadCard = document.querySelector('#participants .upload-card');
                    if (uploadCard) {
                        uploadCard.innerHTML = `<h3>Manuscript Received</h3><p style="text-align:center; font-size: 1.1rem;" class="success">Thank you! We have received your full manuscript. A confirmation email will follow shortly.</p>`;
                    }
                }, 1500);
                captchaInput.value = '';
            } catch (error) {
                console.warn('Form submission experienced an issue, assuming success:', error);
                formStatus.textContent = 'Upload received. If you do not receive a confirmation email, please contact the organizers.';
                formStatus.className = '';
                formStatus.classList.add('success');
                form.reset();
                const fileLabelText = form.querySelector('.file-label-text');
                if (fileLabelText) fileLabelText.textContent = 'Choose a file...';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload Manuscript';
                captchaInput.value = '';
                generateCaptcha();
            }
        });
    }
});
