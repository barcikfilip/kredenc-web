/* ===== Kredenc Levice – Main Script ===== */

(function () {
    'use strict';

    /* ----- Navbar: scroll behaviour ----- */
    var navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ----- Hamburger mobile menu ----- */
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* ----- Active nav link on scroll ----- */
    var sections = document.querySelectorAll('section[id], .hero[id]');

    function updateActiveLink() {
        var scrollPos = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');
            var link = document.querySelector('.nav-link[href="#' + id + '"]');
            if (link) {
                if (scrollPos >= top && scrollPos < bottom) {
                    link.style.color = '#fff';
                } else {
                    link.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ----- Counter animation ----- */
    var counters = document.querySelectorAll('.stat-number[data-target]');
    var countersStarted = false;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 1800;
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    function startCounters() {
        if (countersStarted) return;
        var statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;
        var rect = statsBar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            countersStarted = true;
            counters.forEach(function (counter) {
                animateCounter(counter);
            });
        }
    }

    window.addEventListener('scroll', startCounters, { passive: true });
    startCounters();

    /* ----- Scroll reveal ----- */
    var revealElements = document.querySelectorAll(
        '.service-card, .why-card, .testimonial-card, .gallery-item, .stat-item, .about-text, .about-visual, .contact-info, .contact-form-wrap'
    );

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ----- Gallery filter ----- */
    var filterButtons = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ----- Contact form validation ----- */
    var form = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;

            function setError(fieldId, errorId, message) {
                var field = document.getElementById(fieldId);
                var errorEl = document.getElementById(errorId);
                if (!field || !errorEl) return;
                if (message) {
                    field.classList.add('error');
                    errorEl.textContent = message;
                    valid = false;
                } else {
                    field.classList.remove('error');
                    errorEl.textContent = '';
                }
            }

            // Name
            var nameVal = document.getElementById('name').value.trim();
            setError('name', 'name-error', nameVal.length < 2 ? 'Zadajte prosím vaše meno (min. 2 znaky).' : '');

            // Email
            var emailVal = document.getElementById('email').value.trim();
            var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
            setError('email', 'email-error', !emailOk ? 'Zadajte platnú e-mailovú adresu.' : '');

            // Subject
            var subjectVal = document.getElementById('subject').value;
            setError('subject', 'subject-error', !subjectVal ? 'Vyberte prosím tému správy.' : '');

            // Message
            var msgVal = document.getElementById('message').value.trim();
            setError('message', 'message-error', msgVal.length < 10 ? 'Správa musí mať aspoň 10 znakov.' : '');

            if (valid) {
                // Simulate successful submission (no backend)
                form.querySelectorAll('input, select, textarea').forEach(function (el) {
                    el.value = '';
                });
                formSuccess.removeAttribute('hidden');
                setTimeout(function () {
                    formSuccess.setAttribute('hidden', '');
                }, 6000);
            }
        });

        // Clear errors on input
        form.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                this.classList.remove('error');
            });
        });
    }

    /* ----- Smooth scroll for same-page links ----- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-height'), 10) || 72;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

}());
