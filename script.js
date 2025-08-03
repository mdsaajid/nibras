document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });
    });

    // Dark/Light Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Animation Effects (Fade-in, Slide-up)
    const animateElements = document.querySelectorAll('.fade-in, .slide-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;

            // Close all other open accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current accordion
            header.classList.toggle('active');
            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null;
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    });

    // Contact Form Submission (EmailJS)
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    // Initialize EmailJS (replace with your actual User ID)
    // emailjs.init("YOUR_EMAILJS_USER_ID"); // Example: emailjs.init("user_YOUR_USER_ID_HERE");

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Dummy submission for demonstration if EmailJS is not configured
        if (typeof emailjs === 'undefined' || !emailjs.init) {
            formMessages.textContent = 'Message sent successfully! (Dummy submission)';
            formMessages.classList.remove('error');
            formMessages.classList.add('success');
            contactForm.reset();
            return;
        }

        // For actual EmailJS integration, uncomment and configure below:
        /*
        const serviceID = 'YOUR_SERVICE_ID'; // e.g., 'service_abcdef'
        const templateID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_ghijkl'

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                formMessages.textContent = 'Message sent successfully!';
                formMessages.classList.remove('error');
                formMessages.classList.add('success');
                contactForm.reset();
            }, (error) => {
                console.error('EmailJS Error:', error);
                formMessages.textContent = 'Failed to send message. Please try again later.';
                formMessages.classList.remove('success');
                formMessages.classList.add('error');
            });
        */
        // If you are using EmailJS, uncomment the above block and comment out the dummy submission.
        // Make sure to replace 'YOUR_EMAILJS_USER_ID', 'YOUR_SERVICE_ID', and 'YOUR_TEMPLATE_ID'.
    });
});