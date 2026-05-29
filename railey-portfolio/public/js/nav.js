document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Smart Navigation (Hide on scroll down, show on up)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        // Don't hide header if mobile menu is open
        if (!navLinks.classList.contains('open')) {
          // Add scrolled class when user scrolls past 80px (header height)
          if (currentScroll > 80) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Use IntersectionObserver for active link highlighting to avoid layout thrashing
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px', // Trigger when section is in top part of viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href').includes(id)) {
            a.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });

  // Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile menu when clicking a link
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (menuToggle.classList.contains('open')) {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
});
