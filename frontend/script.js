document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Анімації появи блоків (ТЕПЕР ПРАЦЮЮТЬ ЛИШЕ ОДИН РАЗ, БЕЗ ЛАГІВ НА ТЕЛЕФОНІ)
    const observerOptions = { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.1 
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Вимикаємо спостереження, щоб елемент не зникав і не дьоргався при скролі вгору
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in').forEach(section => {
        observer.observe(section);
    });

    // 2. Логіка хедера та мобільної Sticky CTA
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

    // 3. Відкриття/закриття мобільного меню
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

    // 4. Cookie Banner Логіка
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