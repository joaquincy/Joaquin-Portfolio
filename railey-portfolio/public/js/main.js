document.addEventListener('DOMContentLoaded', () => {
  // Set copyright year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Work section filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.classList.remove('hide');
          // small delay for layout calculation before triggering transition
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
    });
  });

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
        const response = await fetch('/api/groq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: `New lead from ${data.name} (${data.email}) regarding ${data.subject}. Message: ${data.message}` })
        });

        const result = await response.json();

        if (result.success) {
          formStatus.textContent = "Thank you! Your message has been sent successfully.";
          formStatus.className = 'form-status mt-4 success';
          contactForm.reset();
        } else {
          throw new Error('Server returned an error');
        }
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
});
