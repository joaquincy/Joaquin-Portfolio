document.addEventListener('DOMContentLoaded', () => {
  // Only enable custom cursor on non-touch devices
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      // Dot follows exactly
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Outline follows with a tiny delay using animation
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, {
        duration: 500,
        fill: 'forwards',
        easing: 'ease-out'
      });
    });

    // Add hover effect for links and buttons
    const hoverElements = document.querySelectorAll('a, button, .work-card');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  } else {
    // Hide cursor elements on touch devices
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (dot) dot.style.display = 'none';
    if (outline) outline.style.display = 'none';
  }
});
