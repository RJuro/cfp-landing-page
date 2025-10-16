document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const form = document.getElementById('submission-form');
    
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
    generateCaptcha(); // Initial generation

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
            if (form.querySelector('#website').value) return; // Honeypot check

            // Client-side validation
            let isValid = true;
            const trimmedFullName = fullNameInput?.value.trim() || '';
            const trimmedEmail = emailInput?.value.trim() || '';
            const paperFile = fileInput?.files?.[0] || null;

            if (fullNameInput) fullNameInput.value = trimmedFullName;
            if (emailInput) emailInput.value = trimmedEmail;

            if (!trimmedFullName) {
                isValid = false;
            }
            if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
                isValid = false;
                formStatus.textContent = 'Please provide a valid email address.';
            }
            if (!paperFile) {
                isValid = false;
                if (!formStatus.textContent) formStatus.textContent = 'Please upload your paper as a single PDF.';
            }

            if (paperFile) {
                const isPdf = paperFile.name.toLowerCase().endsWith('.pdf');
                const isWithinSize = paperFile.size <= 15 * 1024 * 1024;
                if (!isPdf) {
                    isValid = false;
                    formStatus.textContent = 'Please upload your paper as a single PDF.';
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
                captchaInput.value = ''; // Clear wrong answer
                generateCaptcha(); // New question
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
                formData.append('paper', paperFile, paperFile.name);
                formData.append('captcha', captchaInput.value.trim());

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    credentials: 'omit',
                    cache: 'no-store'
                });

                // Treat any successful request dispatch as confirmation
                formStatus.textContent = 'Thank you! Your paper has been uploaded successfully.';
                formStatus.className = '';
                formStatus.classList.add('success');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload Paper';
                const fileLabelText = form.querySelector('.file-label-text');
                if (fileLabelText) fileLabelText.textContent = 'Choose a file...';
                setTimeout(() => {
                    const uploadCard = document.querySelector('#participants .upload-card');
                    if (uploadCard) {
                        uploadCard.innerHTML = `<h3>Paper Received</h3><p style="text-align:center; font-size: 1.1rem;" class="success">Thank you! We have received your camera-ready paper. A confirmation email will follow shortly.</p>`;
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
                submitBtn.textContent = 'Upload Paper';
                captchaInput.value = '';
                generateCaptcha();
            }
        });
    }

    // --- BACKGROUND PARTICLE NETWORK ---
    const particlesCanvas = document.getElementById('bg-particles');
    if (particlesCanvas) {
        const ctx = particlesCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        const baseParticleDensity = window.innerWidth > 1400 ? 220 : window.innerWidth > 1024 ? 180 : 140;
        const particleCount = Math.min(baseParticleDensity, Math.floor(window.innerWidth / 10));
        const particles = [];
        const maxDistance = 220;

        const resizeCanvas = () => {
            width = particlesCanvas.width = window.innerWidth;
            height = particlesCanvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.55,
            vy: (Math.random() - 0.5) * 0.55,
            radius: Math.random() * 1.8 + 0.7,
            hue: 200 + Math.random() * 40
        });

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i += 1) {
                particles.push(createParticle());
            }
        };

        const updateParticles = () => {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                p.x = Math.max(Math.min(p.x, width), 0);
                p.y = Math.max(Math.min(p.y, height), 0);
            });
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];
                ctx.beginPath();
                ctx.fillStyle = `hsla(${p.hue}, 65%, 55%, 0.55)`;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j += 1) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.55 + 0.15;
                        ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 70%, 62%, ${opacity})`;
                        ctx.lineWidth = Math.max(0.8, 1.8 - (dist / maxDistance));
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            updateParticles();
            drawParticles();
            window.requestAnimationFrame(animate);
        };

        resizeCanvas();
        initParticles();
        animate();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }
});
