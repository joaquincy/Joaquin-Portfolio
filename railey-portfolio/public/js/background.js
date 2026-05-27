// Background Shapes Logic
// We generate some random positions for the pure CSS shapes to drift around

document.addEventListener('DOMContentLoaded', () => {
  const shapes = document.querySelectorAll('.bg-shapes .shape');
  
  // Randomize initial positions slightly
  shapes.forEach((shape, index) => {
    const randomX = Math.floor(Math.random() * 100);
    const randomY = Math.floor(Math.random() * 100);
    
    // The CSS handles the actual animation, we just set initial positions
    shape.style.left = `${randomX}%`;
    shape.style.top = `${randomY}%`;
    
    // Add varying animation delays so they don't move in sync
    shape.style.animationDelay = `${index * -5}s`;
  });
});
