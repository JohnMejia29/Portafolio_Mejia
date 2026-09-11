/* ==========================================================================
   RETRO CASSETTE DECK INTERACTION - BUTTONS, LEDS, ROTATING SPOOLS & BADGES
   ========================================================================== */

const FRAMEWORK_DATA = {
  frontend: [
    { name: 'React', icon: './stack_icons/react.svg' },
    { name: 'Next.js', icon: './stack_icons/nextjs.svg' },
    { name: 'Astro', icon: './stack_icons/astro.svg' },
    { name: 'Tailwind', icon: './stack_icons/tailwind.svg' },
    { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
    { name: 'JavaScript', icon: './stack_icons/javascript.svg' }
  ],
  backend: [
    { name: 'Node.js', icon: './stack_icons/node.svg' },
    { name: 'Express', icon: './stack_icons/express.svg' },
    { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
    { name: 'Supabase', icon: './stack_icons/supabase.svg' },
    { name: 'SQL', icon: './stack_icons/sql.svg' }
  ],
  movil: [
    { name: 'React Native', icon: './stack_icons/react.svg' },
    { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
    { name: 'Supabase', icon: './stack_icons/supabase.svg' }
  ]
};

export function initCassetteDeck() {
  const cassetteBtnWrappers = document.querySelectorAll('.cassette-btn-wrapper');
  const badgesContainer = document.getElementById('cassette-badges-container');
  const spools = document.querySelectorAll('.tape-spool');

  if (!cassetteBtnWrappers.length || !badgesContainer) return;

  function renderBadges(category) {
    const items = FRAMEWORK_DATA[category] || FRAMEWORK_DATA.frontend;
    
    // Animate tape spools briefly
    spools.forEach(spool => spool.classList.add('spinning'));
    
    badgesContainer.style.opacity = '0.3';
    
    setTimeout(() => {
      badgesContainer.innerHTML = '';
      items.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'framework-badge';
        badge.innerHTML = `<img src="${item.icon}" alt="" width="18" height="18" loading="lazy"> <span>${item.name}</span>`;
        badgesContainer.appendChild(badge);
      });
      badgesContainer.style.transition = 'opacity 0.2s ease';
      badgesContainer.style.opacity = '1';
    }, 120);

    setTimeout(() => {
      spools.forEach(spool => spool.classList.remove('spinning'));
    }, 800);
  }

  cassetteBtnWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.cassette-mech-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const category = wrapper.getAttribute('data-framework');

      // Update active state (mechanical push down and glowing LED)
      cassetteBtnWrappers.forEach(w => w.classList.remove('active'));
      wrapper.classList.add('active');

      renderBadges(category);
    });
  });

  // Initial load
  renderBadges('frontend');
}
