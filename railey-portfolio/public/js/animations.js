// Intersection Observer for Scroll Animations and Counters

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveals
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // 2. Number Counters
  const counterElements = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        el.innerText = target;
      }
    };

    updateCounter();
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  // 3. Parallax Split on Stats Row — lightweight rAF-based
  const parallaxStats = document.querySelectorAll('.parallax-stat');

  if (parallaxStats.length) {
    const aboutSection = document.getElementById('about');
    let ticking = false;

    const updateParallax = () => {
      if (!aboutSection) return;
      const rect = aboutSection.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only calculate when the about section is near viewport
      if (rect.top < windowH && rect.bottom > 0) {
        // How far past the viewport top the section has scrolled (0 at bottom edge, positive as it rises)
        const scrolled = windowH - rect.top;

        parallaxStats.forEach(stat => {
          const speed = parseFloat(stat.dataset.speed) || 1;
          const yOffset = (scrolled * speed * 0.05) - 20; // subtle movement
          stat.style.transform = `translateY(${yOffset}px)`;
        });
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
});

// ── Text Scramble Effect ─────────────────────────────────────
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = i * 4;           // ← each char starts 4 frames after the previous
      const end = start + 30;      // ← each char scrambles for 18 frames then locks in
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.12) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += char;           // ← plain char, no span wrapper
      } else {
        output += from;
      }
    }

    this.el.textContent = output; // ← textContent: no HTML parse, no DOM nodes

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// ── Scramble Controller ──────────────────────────────────────
const scrambleEl = document.getElementById('scramble-text');

if (scrambleEl) {
  const fx = new TextScramble(scrambleEl);

  const phrases = [
    'Railey Joaquin',
    'A Graphic Designer',
    'A Web Designer',
    'A Video Editor',
    'An All-Rounder',
  ];

  let currentIndex = 0;
  let cycleInterval = null;
  let isHovering = false;

  // On page load — scramble reveal into name
  window.addEventListener('load', () => {
    setTimeout(() => fx.setText('Railey Joaquin'), 900);
  });

  // Hover — cycle through phrases
  const heroTitle = document.querySelector('.hero-title');

  function startCycle() {
    if (isHovering) return; // prevent double trigger
    isHovering = true;
    currentIndex = 1;
    fx.setText(phrases[currentIndex]);

    cycleInterval = setInterval(() => {
      if (!isHovering) return;
      currentIndex = (currentIndex % (phrases.length - 1)) + 1;
      fx.setText(phrases[currentIndex]);
    }, 3500);
  }

  function stopCycle() {
    isHovering = false;
    clearInterval(cycleInterval);
    currentIndex = 0;
    fx.setText('Railey Joaquin');
  }

  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', startCycle);
    heroTitle.addEventListener('mouseleave', stopCycle);
  }
}