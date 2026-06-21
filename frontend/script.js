document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Анімації появи загальних блоків (ПРАЦЮЮТЬ ЗАВЖДИ У ДВІ СТОРОНИ)
    // Трюк: rootMargin розширює зону по боках на 3000px.
    // Тепер горизонтальний свайп не ламає картки, а скрол вгору/вниз працює завжди!
    const observerOptions = { 
        root: null, 
        rootMargin: '0px 3000px 0px 3000px', 
        threshold: 0.1 
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Забираємо клас, щоб при поверненні до блоку анімація відбулась знову
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in').forEach(section => {
        observer.observe(section);
    });

    // =========================================================
    // 2. АНІМАЦІЯ КАРТОК ПРИ ГОРИЗОНТАЛЬНОМУ СВАЙПІ НА ТЕЛЕФОНІ
    // =========================================================
    const carouselObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // Спрацьовує, коли картка на 60% в центрі екрана
    };

    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-centered');
            } else {
                entry.target.classList.remove('is-centered');
            }
        });
    }, carouselObserverOptions);

    const initCarouselAnimation = () => {
        const cards = document.querySelectorAll('.barber-card, .review-card');
        if (window.innerWidth <= 768) {
            cards.forEach(card => carouselObserver.observe(card));
        } else {
            cards.forEach(card => {
                carouselObserver.unobserve(card);
                card.classList.remove('is-centered'); // Зкидаємо на ПК
            });
        }
    };

    initCarouselAnimation();
    window.addEventListener('resize', initCarouselAnimation);


    // 3. Логіка хедера та мобільної Sticky CTA
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mobileStickyCta = document.querySelector('.mobile-sticky-cta');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ховаємо/показуємо хедер
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.classList.add('header-hidden');
            if (mainNav && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Поява Sticky CTA після 30% прокрутки
        if (mobileStickyCta) {
            const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScrollableHeight > 0) {
                const scrollPercent = (scrollTop / totalScrollableHeight) * 100;
                
                if (scrollPercent >= 30) {
                    mobileStickyCta.classList.add('show');
                } else {
                    mobileStickyCta.classList.remove('show');
                }
            }
        }
    });

    // 4. Відкриття/закриття мобільного меню
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 5. Встановлення мінімальної дати (завтра) для форми запису
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // 6. Логіка відправки форми (Web3Forms)
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Відправка...';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                successModal.classList.add('active');
                bookingForm.reset();
            })
            .catch(error => {
                console.error('Помилка відправки', error);
                successModal.classList.add('active');
                bookingForm.reset();
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // 7. Cookie Banner Логіка
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});