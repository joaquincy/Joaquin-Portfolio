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
    
    if (currentScroll <= 0) {
      header.classList.remove('nav-hidden');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('nav-hidden')) {
      // Scroll Down
      header.classList.add('nav-hidden');
    } else if (currentScroll < lastScroll && header.classList.contains('nav-hidden')) {
      // Scroll Up
      header.classList.remove('nav-hidden');
    }
    
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
