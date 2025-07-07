document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const expandBtn = document.querySelector('.expand-btn');
    const expandableContent = document.querySelector('.expandable-content .more-text');
    const expandableListItems = document.querySelectorAll('.expandable-list li');
    const copyEmails = document.querySelectorAll('.copy-email');

    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    if(expandBtn && expandableContent) {
        expandBtn.addEventListener('click', () => {
            const isExpanded = expandableContent.style.display === 'block';
            expandableContent.style.display = isExpanded ? 'none' : 'block';
            expandBtn.textContent = isExpanded ? 'Read More' : 'Read Less';
        });
    }

    expandableListItems.forEach(item => {
        const header = item.querySelector('.list-item-header');
        const content = item.querySelector('.list-item-content');
        const chevron = item.querySelector('.chevron');

        header.addEventListener('click', () => {
            const isExpanded = content.style.display === 'block';
            content.style.display = isExpanded ? 'none' : 'block';
            chevron.classList.toggle('rotated', !isExpanded);
        });
    });

    copyEmails.forEach(email => {
        email.addEventListener('click', () => {
            const emailText = email.textContent;
            navigator.clipboard.writeText(emailText).then(() => {
                email.textContent = 'Copied!';
                setTimeout(() => {
                    email.textContent = emailText;
                }, 2000);
            });
        });
    });
});
