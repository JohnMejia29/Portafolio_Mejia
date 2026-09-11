/* ==========================================================================
   PEGBOARD INTERACTION - TOOL CARDS PENDULUM BALANCE & SOUND EFFECT
   ========================================================================== */

export function initPegboard() {
  const pegboardItems = document.querySelectorAll('.pegboard-item');

  pegboardItems.forEach(item => {
    // Reset and trigger swing on hover / mouseenter
    item.addEventListener('mouseenter', () => {
      item.style.animation = 'none';
      // Force reflow
      void item.offsetWidth;
      item.style.animation = 'swingPendulum 0.75s ease-in-out';
    });

    item.addEventListener('click', () => {
      item.style.animation = 'none';
      void item.offsetWidth;
      item.style.animation = 'swingPendulum 0.9s ease-in-out';
    });
  });
}
