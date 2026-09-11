/* ==========================================================================
   PROJECTS FILTERING - DYNAMIC CATEGORIES (Todos, Web, Móvil, Backend)
   ========================================================================== */

export function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyState = document.getElementById('projects-empty-state');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update button active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;

      // Filter project cards
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 10);
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show empty state if no project matches
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'block';
        } else {
          emptyState.style.display = 'none';
        }
      }
    });
  });
}
