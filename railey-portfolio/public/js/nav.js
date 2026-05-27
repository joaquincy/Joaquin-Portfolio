document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  let lastScroll = 0;

  // Smart Navigation (Hide on scroll down, show on up)
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Don't hide header if mobile menu is open
    if (navLinks.classList.contains('open')) return;

    // Add scrolled class when user scrolls past 80px (header height)
    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Keep lastScroll updated if needed in future
    lastScroll = currentScroll;

    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href').includes(current)) {
        a.classList.add('active');
      }
    });
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
