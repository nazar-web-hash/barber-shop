document.addEventListener("DOMContentLoaded", () => {
    
    // Анімація появи (Fade-up) при скролі
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(section => observer.observe(section));

    // Логіка хедера (ховається при скролі вниз, з'являється при скролі вгору)
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.classList.add('header-hidden');
            if (mainNav && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Відкриття/закриття мобільного меню
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Закриття меню при кліку на посилання
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});