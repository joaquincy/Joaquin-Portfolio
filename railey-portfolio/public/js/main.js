document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const darkModeText = darkModeToggle ? darkModeToggle.querySelector('span') : null;

  // Check local storage for theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    if (darkModeText) darkModeText.textContent = 'LIGHT';
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');

      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        if (darkModeText) darkModeText.textContent = 'LIGHT';
      } else {
        localStorage.setItem('theme', 'light');
        if (darkModeText) darkModeText.textContent = 'DARK';
      }
    });
  }

  // Set copyright year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Work section filtering and search
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  const searchInput = document.querySelector('.work-search input');

  let currentFilter = 'all';
  let currentSearch = '';

  const updateWorkCards = () => {
    workCards.forEach(card => {
      const matchesFilter = currentFilter === 'all' || (card.getAttribute('data-category') || '').includes(currentFilter);
      const matchesSearch = currentSearch === '' || card.textContent.toLowerCase().includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hide');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.classList.add('hide');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter');
      updateWorkCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase();
      updateWorkCards();
    });
  }

  // Work section view toggle
  const viewBtns = document.querySelectorAll('.view-btn');
  const workGrid = document.querySelector('.work-grid');

  if (viewBtns.length && workGrid) {
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        viewBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Get view type and update grid class
        const viewType = btn.getAttribute('data-view');

        // Remove existing view classes
        workGrid.classList.remove('view-slider', 'view-list', 'view-grid');

        // Add new view class
        if (viewType) {
          workGrid.classList.add(`view-${viewType}`);
        }
      });
    });
  }

  // Contact Form Submission (Mock API for now)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const btnText = document.querySelector('.btn-text');
  const btnLoader = document.querySelector('.btn-loader');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Update UI to loading state
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-block';
      formStatus.className = 'form-status mt-4';
      formStatus.style.display = 'none';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        // Simulate network request delay (Mock API)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Display success message
        formStatus.textContent = "Thank you! Your message has been sent successfully.";
        formStatus.className = 'form-status mt-4 success';
        contactForm.reset();
      } catch (error) {
        formStatus.textContent = "Oops! Something went wrong. Please try again later.";
        formStatus.className = 'form-status mt-4 error';
      } finally {
        formStatus.style.display = 'block';
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
      }
    });
  }

  // Testimonials Auto-scroll Carousel (Infinite Loop)
  const testimonialsScroll = document.querySelector('.testimonials-scroll');
  if (testimonialsScroll) {
    const cards = Array.from(testimonialsScroll.children);

    // Calculate the width of one original set of cards, including the gap.
    // We can do this by measuring the distance from the first card's left edge to the last card's right edge + one gap.
    const gap = 20; // 20px gap from CSS
    let originalSetWidth = 0;
    cards.forEach(card => {
      originalSetWidth += card.offsetWidth + gap;
    });

    // Clone the cards multiple times to ensure we have plenty of runway even on ultra-wide screens
    for (let i = 0; i < 4; i++) {
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        testimonialsScroll.appendChild(clone);
      });
    }

    let scrollSpeed = 1;
    let isHovered = false;
    let animationId;

    const scroll = () => {
      if (!isHovered) {
        testimonialsScroll.scrollLeft += scrollSpeed;

        // Reset seamlessly when we've scrolled exactly one original set's width
        if (testimonialsScroll.scrollLeft >= originalSetWidth) {
          testimonialsScroll.scrollLeft -= originalSetWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    testimonialsScroll.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    testimonialsScroll.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Handle touch devices
    testimonialsScroll.addEventListener('touchstart', () => {
      isHovered = true;
    });

    testimonialsScroll.addEventListener('touchend', () => {
      // Resume scroll after a small delay on touch end
      setTimeout(() => {
        isHovered = false;
      }, 1000);
    });

    scroll();
  }
});
