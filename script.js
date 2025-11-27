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

    // --- PROGRAMME ACCORDION & TIME RANGES ---

    function updateTimeRanges() {
        // Helper to parse time string "HH:MM" to minutes
        const parseTime = (timeStr) => {
            if (!timeStr) return 0;
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // Helper to format minutes back to "HH:MM"
        const formatTime = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        // Process Day Headers
        document.querySelectorAll('.programme-day').forEach(day => {
            const dayHeader = day.querySelector('.day-header');
            const timeElements = day.querySelectorAll('.session-time, .paper-time, .track-time');

            let minTime = Infinity;
            let maxTime = -Infinity;

            timeElements.forEach(el => {
                const text = el.textContent.trim();
                // Extract times like "08:30 – 09:00" or "17:30"
                const matches = text.match(/(\d{2}:\d{2})/g);
                if (matches) {
                    matches.forEach(time => {
                        const minutes = parseTime(time);
                        if (minutes < minTime) minTime = minutes;
                        if (minutes > maxTime) maxTime = minutes;
                    });
                }
            });

            if (minTime !== Infinity && maxTime !== -Infinity) {
                const timeRange = document.createElement('div');
                timeRange.className = 'header-time-range';
                timeRange.textContent = `${formatTime(minTime)} – ${formatTime(maxTime)}`;
                // Insert before the toggle icon
                const icon = dayHeader.querySelector('.toggle-icon');
                dayHeader.insertBefore(timeRange, icon);
            }
        });

        // Process Block Titles
        document.querySelectorAll('.session-block').forEach(block => {
            const blockTitle = block.querySelector('.block-title');
            if (!blockTitle) return;

            const timeElements = block.querySelectorAll('.session-time, .paper-time, .track-time');

            let minTime = Infinity;
            let maxTime = -Infinity;

            timeElements.forEach(el => {
                const text = el.textContent.trim();
                const matches = text.match(/(\d{2}:\d{2})/g);
                if (matches) {
                    matches.forEach(time => {
                        const minutes = parseTime(time);
                        if (minutes < minTime) minTime = minutes;
                        if (minutes > maxTime) maxTime = minutes;
                    });
                }
            });

            if (minTime !== Infinity && maxTime !== -Infinity) {
                const timeRange = document.createElement('div');
                timeRange.className = 'header-time-range';
                timeRange.textContent = `${formatTime(minTime)} – ${formatTime(maxTime)}`;
                const icon = blockTitle.querySelector('.toggle-icon');
                blockTitle.insertBefore(timeRange, icon);
            }
        });
    }

    updateTimeRanges();

    const dayHeaders = document.querySelectorAll('.day-header');
    dayHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            const content = header.nextElementSibling;
            if (content && content.classList.contains('day-content')) {
                content.classList.toggle('collapsed');
            }
        });
    });

    const blockTitles = document.querySelectorAll('.block-title');
    blockTitles.forEach(title => {
        title.addEventListener('click', () => {
            title.classList.toggle('collapsed');
            const content = title.nextElementSibling;
            if (content && content.classList.contains('block-content')) {
                content.classList.toggle('collapsed');
            }
        });
    });

    // --- CAMERA READY FORM SUBMISSION ---
    const cameraReadyForm = document.getElementById('camera-ready-form');
    const crCaptchaQuestion = document.getElementById('cr-captcha-question');
    const crSubmitBtn = document.getElementById('cr-submit-btn');
    const crFormMessage = document.getElementById('cr-form-message');

    // Generate captcha question
    let crNum1, crNum2, crAnswer;
    if (crCaptchaQuestion) {
        crNum1 = Math.floor(Math.random() * 10) + 1;
        crNum2 = Math.floor(Math.random() * 10) + 1;
        crAnswer = crNum1 + crNum2;
        crCaptchaQuestion.textContent = `${crNum1} + ${crNum2}`;
    }

    // File input display
    const crFileInput = document.getElementById('cr-file');
    if (crFileInput) {
        crFileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'Choose PDF file...';
            const label = crFileInput.closest('.file-upload-wrapper').querySelector('.file-upload-label');
            if (label) label.textContent = fileName;
        });
    }

    // Form submission
    if (cameraReadyForm) {
        cameraReadyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide previous messages
            crFormMessage.className = 'form-message';

            // Validate CAPTCHA
            const captchaInput = document.getElementById('cr-captcha');
            if (parseInt(captchaInput.value) !== crAnswer) {
                crFormMessage.textContent = 'Incorrect answer to security question. Please try again.';
                crFormMessage.className = 'form-message error';
                return;
            }

            // Validate file
            const fileInput = document.getElementById('cr-file');
            const file = fileInput.files[0];

            if (!file) {
                crFormMessage.textContent = 'Please select a PDF file to upload.';
                crFormMessage.className = 'form-message error';
                return;
            }

            if (file.type !== 'application/pdf') {
                crFormMessage.textContent = 'Please upload a PDF file only.';
                crFormMessage.className = 'form-message error';
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB
                crFormMessage.textContent = 'File size must be less than 10 MB.';
                crFormMessage.className = 'form-message error';
                return;
            }

            // Show loading state
            crSubmitBtn.classList.add('loading');
            crSubmitBtn.disabled = true;

            // Prepare form data
            const formData = new FormData();
            formData.append('full_name', document.getElementById('cr-full-name').value);
            formData.append('email', document.getElementById('cr-email').value);
            formData.append('paper_title', document.getElementById('cr-paper-title').value);
            formData.append('submission_type', document.getElementById('cr-submission-type').value);
            formData.append('camera_ready_file', file);
            formData.append('captcha', captchaInput.value);

            try {
                // Submit to n8n webhook - UPDATE THIS URL WITH YOUR ACTUAL n8n WEBHOOK URL
                const webhookURL = 'https://n8n.automate.business.aau.dk/webhook/6a3e5777-c598-41f7-ab65-113973636107';

                const response = await fetch(webhookURL, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    crFormMessage.textContent = 'Success! Your camera ready submission has been received. You will receive a confirmation email shortly.';
                    crFormMessage.className = 'form-message success';
                    cameraReadyForm.reset();

                    // Reset captcha
                    crNum1 = Math.floor(Math.random() * 10) + 1;
                    crNum2 = Math.floor(Math.random() * 10) + 1;
                    crAnswer = crNum1 + crNum2;
                    crCaptchaQuestion.textContent = `${crNum1} + ${crNum2}`;

                    // Scroll to message
                    crFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                crFormMessage.textContent = 'An error occurred while submitting your paper. Please try again or contact roman@business.aau.dk for assistance.';
                crFormMessage.className = 'form-message error';
            } finally {
                crSubmitBtn.classList.remove('loading');
                crSubmitBtn.disabled = false;
            }
        });
    }

});
