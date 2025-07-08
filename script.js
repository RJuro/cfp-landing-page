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

    // --- FORM SUBMISSION HANDLING ---
    if (form) {
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-form-btn');
        const fileInput = form.querySelector('.file-input');
        const webhookUrl = 'https://n8n.rjuro.com/webhook/6a3e5777-c598-41f7-ab65-113973636107';

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
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim() || (input.type === 'file' && input.files.length === 0)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'error';
                return;
            }

            // Captcha validation
            const userAnswer = parseInt(form.querySelector('#captcha').value, 10);
            if (userAnswer !== captchaCorrectAnswer) {
                formStatus.textContent = 'Incorrect security answer. A new question has been generated.';
                formStatus.className = 'error';
                form.querySelector('#captcha').value = ''; // Clear wrong answer
                generateCaptcha(); // New question
                return;
            }

            // Start submission process
            formStatus.textContent = 'Submitting, please wait...';
            formStatus.className = '';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const formData = new FormData(form);
                const response = await fetch(webhookUrl, { method: 'POST', body: formData });

                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your abstract has been submitted successfully.';
                    formStatus.classList.add('success');
                    form.reset();
                    form.querySelector('.file-label-text').textContent = 'Choose a file...';
                    setTimeout(() => {
                        const submissionContainer = document.querySelector('#submission .container');
                        submissionContainer.innerHTML = `<h2>Submission Received</h2><p style="text-align:center; font-size: 1.1rem;" class="success">Thank you! Your submission has been received. We will be in touch by the dates specified.</p>`;
                    }, 1500);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'An unknown error occurred during submission.');
                }
            } catch (error) {
                formStatus.textContent = 'An error occurred. Please try again or contact us directly.';
                formStatus.classList.add('error');
                console.error('Form submission error:', error);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Abstract';
                generateCaptcha();
            }
        });
    }
});