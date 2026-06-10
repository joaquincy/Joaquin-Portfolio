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
  let viewAllWorks = false;
  const initialVisibleCount = 4;
  const viewAllWorksBtn = document.getElementById('view-all-works-btn');

  const updateWorkCards = () => {
    let visibleCount = 0;

    // First, count how many would match the filter/search overall
    let totalMatching = 0;
    workCards.forEach(card => {
      const matchesFilter = currentFilter === 'all' || (card.getAttribute('data-category') || '').includes(currentFilter);
      const matchesSearch = currentSearch === '' || card.textContent.toLowerCase().includes(currentSearch);
      if (matchesFilter && matchesSearch) totalMatching++;
    });

    workCards.forEach(card => {
      const matchesFilter = currentFilter === 'all' || (card.getAttribute('data-category') || '').includes(currentFilter);
      const matchesSearch = currentSearch === '' || card.textContent.toLowerCase().includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        if (!viewAllWorks && visibleCount >= initialVisibleCount) {
          card.classList.add('hide');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        } else {
          card.classList.remove('hide');
          // Add a slight stagger to the reveal
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50 + (visibleCount % initialVisibleCount) * 50);
          visibleCount++;
        }
      } else {
        card.classList.add('hide');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });

    if (viewAllWorksBtn) {
      if (totalMatching <= initialVisibleCount) {
        viewAllWorksBtn.style.display = 'none';
      } else {
        viewAllWorksBtn.style.display = 'inline-flex';
        const btnText = viewAllWorksBtn.querySelector('.btn-text');
        const chevron = viewAllWorksBtn.querySelector('.chevron-icon');
        if (viewAllWorks) {
          btnText.textContent = 'Show Less';
          chevron.style.transform = 'rotate(180deg)';
        } else {
          btnText.textContent = 'View All Works';
          chevron.style.transform = 'rotate(0deg)';
        }
      }
    }
  };

  if (viewAllWorksBtn) {
    viewAllWorksBtn.addEventListener('click', () => {
      viewAllWorks = !viewAllWorks;
      updateWorkCards();
    });
  }

  // Initial call to set correct visibility
  updateWorkCards();

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

  // Contact Form Submission (Web3Forms API)
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
        // Add Web3Forms access key
        data.access_key = '0ec2646b-b85a-4414-9b21-8d41834a7876';

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.status === 200) {
          formStatus.textContent = "Thank you! Your message has been sent successfully.";
          formStatus.className = 'form-status mt-4 success';
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Something went wrong');
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

  // --- Modal Logic ---

  // Dummy data for projects. Replace with your actual project content!
  const projectData = {
    "1": {
      title: "Siomai Street Website",
      category: "Branding & Web Design",
      description: "A complete rebranding and website redesign for Siomai Street, focusing on improving user engagement and modernizing their digital presence.",
      images: [
        "/assets/images/SiomaiStreet.webp",
        "/assets/images/feedback.webp",
        "/assets/images/menu.webp"
      ]
    },
    "2": {
      title: "The Contemporary World",
      category: "Web Design",
      description: "An e-commerce platform built for The Contemporary World, optimizing conversion rates and providing a seamless shopping experience.",
      images: [
        "/assets/images/contemporarycover.png"
      ]
    },
    "3": {
      title: "E-Nazareno Website",
      category: "Infomation Website",
      description: "Editorial layout and typography for the E-Nazareno project, bringing physical aesthetics into a digital format.",
      images: [
        "/assets/images/Homepage.webp",
        "/assets/images/Homepage2.webp",
        "/assets/images/Books.webp",
        "/assets/images/Books2.webp",
        "/assets/images/LamanLibro.webp",
        "/assets/images/About.webp",
        "/assets/images/About2.webp"
      ]
    },
    // "4": {
    //   title: "Panuri",
    //   category: "Motion",
    //   description: "A promotional motion graphics campaign for Nexus, designed to capture attention quickly on social media platforms.",
    //   images: [
    //     "/assets/images/Contemporary-world.webp"
    //   ]
    // },
    "5": {
      title: "Kartel Website",
      category: "Website",
      description: "This is a placeholder description for project 5.",
      images: ["/assets/images/KartelWebsite.webp",
        "/assets/images/Carousel1.webp",
        "/assets/images/Carousel2.webp",
        "/assets/images/Carousel3.webp",
        "/assets/images/Pic3.webp",
        "/assets/images/Pic4.webp",
        "/assets/images/Pic5.webp",
      ]
    },
    "6": {
      title: "Panuri",
      category: "Web Design",
      description: "This is a placeholder description for project 6.",
      images: ["/assets/images/11.webp",
        "/assets/images/1.webp",
        "/assets/images/2.webp",
        "/assets/images/3.webp",
        "/assets/images/4.webp",
        "/assets/images/5.webp",
        "/assets/images/6.webp",
        "/assets/images/7.webp",
        "/assets/images/8.webp",
        "/assets/images/9.webp",
        "/assets/images/10.webp",
        "/assets/images/12.webp",
        "/assets/images/13.webp",
        "/assets/images/14.webp",
        "/assets/images/15.webp",
        "/assets/images/16.webp",
        "/assets/images/17.webp",
        "/assets/images/Admin.webp"
      ]
    },
    "7": {
      title: "Xpendly",
      category: "Print",
      description: "This is a placeholder description for project 7.",
      images: ["/assets/images/Contemporary-world.webp"]
    },
    "8": {
      title: "Placeholder Project 8",
      category: "Motion",
      description: "This is a placeholder description for project 8.",
      images: ["/assets/images/Contemporary-world.webp"]
    },
    "9": {
      title: "Placeholder Project 9",
      category: "Branding & Web",
      description: "This is a placeholder description for project 9.",
      images: ["/assets/images/Contemporary-world.webp"]
    },
    "10": {
      title: "Placeholder Project 10",
      category: "Print",
      description: "This is a placeholder description for project 10.",
      images: ["/assets/images/Contemporary-world.webp"]
    },
    "11": {
      title: "Placeholder Project 11",
      category: "Web Design",
      description: "This is a placeholder description for project 11.",
      images: ["/assets/images/Contemporary-world.webp"]
    },
    "12": {
      title: "Placeholder Project 12",
      category: "Motion",
      description: "This is a placeholder description for project 12.",
      images: ["/assets/images/BooksCover.webp",
        "/assets/images/cover1.webp",
        "/assets/images/cover2.webp",
        "/assets/images/cover3.webp",
        "/assets/images/cover4.webp",
        "/assets/images/cover5.webp",
        "/assets/images/cover6.webp"
      ]
    },
    "13": {
      title: "Placeholder Project 13",
      category: "Branding",
      description: "This is a placeholder description for project 13.",
      images: ["/assets/images/filmposter1.webp",
        "/assets/images/heart1.webp",
        "/assets/images/heart2.webp"
      ]
    },
    "14": {
      title: "Placeholder Project 14",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp",
        "/assets/images/canva1.webp",
        "/assets/images/canva2.webp",
        "/assets/images/canva3.webp",
        "/assets/images/canva4.webp",
        "/assets/images/canva5.webp",
        "/assets/images/canva6.webp",
        "/assets/images/canva7.webp",
        "/assets/images/canva8.webp",
        "/assets/images/canva9.webp",
        "/assets/images/canva10.webp",
        "/assets/images/ill1.webp",
        "/assets/images/ill2.webp",
        "/assets/images/ill3.webp",
        "/assets/images/ill4.webp",
        "/assets/images/ill5.webp",
        "/assets/images/ill6.webp",
        "/assets/images/ill7.webp",
        "/assets/images/ill8.webp",
        "/assets/images/ill9.webp",
        "/assets/images/ill10.webp",
        "/assets/images/ill11.webp",
        "/assets/images/ill12.webp",
        "/assets/images/ill13.webp",
        "/assets/images/ill14.webp"
      ]
    },
    "15": {
      title: "Placeholder Project 15",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp",
        "https://res.cloudinary.com/dpqkzsek6/video/upload/f_auto,q_auto/v1781068949/introduction_uv7ztn.mp4"
      ]
    },
    "16": {
      title: "Placeholder Project 16",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp"
      ]
    },
    "17": {
      title: "Placeholder Project 17",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp",
        "https://res.cloudinary.com/dpqkzsek6/video/upload/f_auto,q_auto/v1781070461/nameintro_sydnss.mp4"
      ]
    },
    "18": {
      title: "Placeholder Project 18",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp",
        "https://res.cloudinary.com/dpqkzsek6/video/upload/f_auto,q_auto/v1781071717/commercial_d5u3en.mp4"
      ]
    },

    "19": {
      title: "Placeholder Project 19",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["https://res.cloudinary.com/dpqkzsek6/video/upload/f_auto,q_auto/v1781072820/selfintroductionv2_xsnokm.mp4",
      ]
    },
    "20": {
      title: "Placeholder Project 20",
      category: "Web Design",
      description: "This is a placeholder description for project 14.",
      images: ["/assets/images/canva.webp",
      ]
    }
  };

  // Fetch the modal HTML template and inject it into the page
  fetch('/modal.html')
    .then(response => response.text())
    .then(html => {
      // Append modal HTML to body
      document.body.insertAdjacentHTML('beforeend', html);

      const modal = document.getElementById('workModal');
      const closeBtn = document.querySelector('.work-modal-close');

      const modalTitle = document.getElementById('modalTitle');
      const modalCategory = document.getElementById('modalCategory');
      const modalDescription = document.getElementById('modalDescription');

      const modalMainImage = document.getElementById('modalMainImage');
      const modalMainVideo = document.getElementById('modalMainVideo');
      const modalPrevBtn = document.getElementById('modalPrevBtn');
      const modalNextBtn = document.getElementById('modalNextBtn');
      const modalThumbnails = document.getElementById('modalThumbnails');

      // Zoom feature variables and event handlers
      const modalImageWrapper = document.querySelector('.modal-main-image-wrapper');
      let zoomLevel = 0; // 0: None (1x), 1: Medium (1.8x), 2: Max (3x)

      const resetZoom = () => {
        if (!modalMainImage) return;
        zoomLevel = 0;
        modalMainImage.classList.remove('zoom-level-1', 'zoom-level-2');
        modalMainImage.style.transformOrigin = 'center center';
      };

      if (modalMainImage && modalImageWrapper) {
        modalMainImage.addEventListener('click', () => {
          // Cycle through levels: 0 -> 1 -> 2 -> 0
          zoomLevel = (zoomLevel + 1) % 3;

          modalMainImage.classList.remove('zoom-level-1', 'zoom-level-2');

          if (zoomLevel === 1) {
            modalMainImage.classList.add('zoom-level-1');
          } else if (zoomLevel === 2) {
            modalMainImage.classList.add('zoom-level-2');
          } else {
            resetZoom();
          }
        });

        modalImageWrapper.addEventListener('mousemove', (e) => {
          if (zoomLevel === 0) return;
          const rect = modalImageWrapper.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          modalMainImage.style.transformOrigin = `${x}% ${y}%`;
        });

        modalImageWrapper.addEventListener('touchstart', (e) => {
          if (zoomLevel === 0) return;
          const touch = e.touches[0];
          const rect = modalImageWrapper.getBoundingClientRect();
          let x = ((touch.clientX - rect.left) / rect.width) * 100;
          let y = ((touch.clientY - rect.top) / rect.height) * 100;
          x = Math.max(0, Math.min(100, x));
          y = Math.max(0, Math.min(100, y));
          modalMainImage.style.transformOrigin = `${x}% ${y}%`;
        }, { passive: true });

        modalImageWrapper.addEventListener('touchmove', (e) => {
          if (zoomLevel === 0) return;
          // Prevent page scroll when dragging zoomed image
          if (e.cancelable) e.preventDefault();

          const touch = e.touches[0];
          const rect = modalImageWrapper.getBoundingClientRect();
          let x = ((touch.clientX - rect.left) / rect.width) * 100;
          let y = ((touch.clientY - rect.top) / rect.height) * 100;
          x = Math.max(0, Math.min(100, x));
          y = Math.max(0, Math.min(100, y));
          modalMainImage.style.transformOrigin = `${x}% ${y}%`;
        }, { passive: false });
      }

      let currentImages = [];
      let currentImageIndex = 0;

      const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('video/upload');
      };

      const updateGallery = () => {
        if (!currentImages || currentImages.length === 0) return;

        resetZoom();

        const currentSrc = currentImages[currentImageIndex];
        const isVid = isVideo(currentSrc);

        // Setup main image/video
        if (modalMainImage) modalMainImage.style.opacity = '0';
        if (modalMainVideo) modalMainVideo.style.opacity = '0';

        setTimeout(() => {
          if (isVid) {
            if (modalMainImage) {
              modalMainImage.style.display = 'none';
              modalMainImage.src = '';
            }
            if (modalMainVideo) {
              modalMainVideo.style.display = 'block';
              modalMainVideo.src = currentSrc;
              modalMainVideo.onloadeddata = () => { modalMainVideo.style.opacity = '1'; };
              setTimeout(() => { modalMainVideo.style.opacity = '1'; }, 150); // Fallback
            }
          } else {
            if (modalMainVideo) {
              modalMainVideo.style.display = 'none';
              modalMainVideo.src = '';
            }
            if (modalMainImage) {
              modalMainImage.style.display = 'block';
              modalMainImage.src = currentSrc;
              modalMainImage.onload = () => { modalMainImage.style.opacity = '1'; };
            }
          }
        }, 150);

        // Setup thumbnails
        if (modalThumbnails) {
          modalThumbnails.innerHTML = '';
          if (currentImages.length > 1) {
            modalThumbnails.style.display = 'flex';
            currentImages.forEach((imgSrc, index) => {
              const isThumbVid = isVideo(imgSrc);
              let thumb;

              if (isThumbVid && !imgSrc.includes('cloudinary.com')) {
                thumb = document.createElement('video');
                thumb.src = imgSrc;
                thumb.muted = true;
                thumb.playsInline = true;
                thumb.preload = 'metadata';
              } else {
                thumb = document.createElement('img');
                // For cloudinary videos, change extension to .jpg for lightweight thumbnail
                thumb.src = isThumbVid ? imgSrc.replace(/\.(mp4|webm|ogg)$/i, '.jpg') : imgSrc;
                thumb.alt = `Thumbnail ${index + 1}`;
                thumb.loading = 'lazy';
              }

              thumb.className = 'modal-thumbnail' + (index === currentImageIndex ? ' active' : '');
              thumb.addEventListener('click', () => {
                currentImageIndex = index;
                updateGallery();
              });
              modalThumbnails.appendChild(thumb);
            });
          } else {
            modalThumbnails.style.display = 'none';
          }
        }

        if (modalPrevBtn) modalPrevBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
        if (modalNextBtn) modalNextBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
      };

      if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
          updateGallery();
        });
      }

      if (modalNextBtn) {
        modalNextBtn.addEventListener('click', () => {
          currentImageIndex = (currentImageIndex + 1) % currentImages.length;
          updateGallery();
        });
      }

      // Function to close modal
      const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        resetZoom();
        setTimeout(() => {
          if (modalMainImage) modalMainImage.src = '';
          if (modalMainVideo) modalMainVideo.src = '';
          if (modalThumbnails) modalThumbnails.innerHTML = '';
        }, 300);
      };

      // Add event listeners for closing
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      if (modal) {
        modal.addEventListener('click', (e) => {
          // Close if clicking the overlay background itself (not the content)
          if (e.target === modal) {
            closeModal();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
          closeModal();
        }
      });

      // Add click event to work cards
      const allWorkCards = document.querySelectorAll('.work-card');
      allWorkCards.forEach(card => {
        card.addEventListener('click', () => {
          const projectId = card.getAttribute('data-project-id');
          if (!projectId || !projectData[projectId] || !modal) return;

          const data = projectData[projectId];

          // Populate text data
          if (modalTitle) modalTitle.textContent = data.title;
          if (modalCategory) modalCategory.textContent = data.category;
          if (modalDescription) modalDescription.innerHTML = `<p>${data.description}</p>`;

          // Initialize gallery
          currentImages = data.images || [];
          currentImageIndex = 0;
          updateGallery();

          // Show the modal
          modal.classList.add('active');
          document.body.classList.add('modal-open');
          document.documentElement.classList.add('modal-open');
        });
      });

    })
    .catch(err => console.error('Error loading modal:', err));

});
