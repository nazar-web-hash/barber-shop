document.addEventListener("DOMContentLoaded", () => {
    
    // Анімації появи блоків ПРАЦЮЮТЬ ЗАВЖДИ при скролі і на ПК, і на Телефоні
    const observerOptions = { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.1 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Тут знаходиться секрет: 
                // Якщо ми на телефоні (< 768px), ми НЕ забираємо клас 'visible'.
                // Тому при свайпі карток вбік вони не зникають і не блимають.
                // А на комп'ютерах (> 768px) клас забирається, і анімація повторюється завжди.
                if (window.innerWidth > 768) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in').forEach(section => {
        observer.observe(section);
    });

    // Логіка хедера та мобільної Sticky CTA
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

    // Відкриття/закриття мобільного меню
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Закриття меню при кліку на посилання
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // Встановлення мінімальної дати (завтра) для форми запису
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Логіка відправки форми (Web3Forms)
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

    // Cookie Banner Логіка
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