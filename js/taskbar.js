/* ==========================================================================
   TASKBAR & START MENU - LIVE CLOCK, RETRO AUDIO, SYSTEM TRAY & START MENU
   ========================================================================== */

import { SoundFX } from './sound-fx.js';
import { openArcade } from './arcade.js';
import { openSystemLogs } from './system-logs.js';
import { openAdminPanel } from './admin.js';
import { WindowManager } from './window-manager.js';

export function initTaskbar() {
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu-popup');
  const clockDisplay = document.getElementById('clock-display');
  const soundToggle = document.getElementById('sound-toggle');

  // 1. System Clock (HH:MM AM/PM)
  function updateClock() {
    if (!clockDisplay) return;
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Start Button & Popup Menu
  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = startMenu.classList.toggle('open');
      startBtn.classList.toggle('active', isOpen);
      SoundFX.playClick();
    });

    document.addEventListener('click', (e) => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startBtn.classList.remove('active');
        startMenu.classList.remove('open');
      }
    });

    // Start Menu item actions
    startMenu.querySelectorAll('.start-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        startBtn.classList.remove('active');
        startMenu.classList.remove('open');
        SoundFX.playClick();

        const action = item.dataset.startAction;
        if (action === 'arcade') {
          e.preventDefault();
          openArcade('snake');
        } else if (action === 'logs') {
          e.preventDefault();
          openSystemLogs();
        } else if (action === 'admin') {
          e.preventDefault();
          openAdminPanel();
        } else if (action === 'terminal') {
          e.preventDefault();
          const term = document.getElementById('terminal-content');
          if (term) {
            term.scrollIntoView({ behavior: 'smooth' });
            const input = term.querySelector('#terminal-real-input');
            if (input) input.focus();
          }
        }
      });
    });
  }

  // 3. Sound Toggle in System Tray
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const isEnabled = SoundFX.toggleSound();
      soundToggle.innerHTML = isEnabled 
        ? `<svg class="icon-svg" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
        : `<svg class="icon-svg" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      if (isEnabled) SoundFX.playClick();
    });
  }

  // 4. Attach click sound to buttons
  document.querySelectorAll('button, .retro-btn, .filter-btn, .nav-link, .cassette-mech-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      SoundFX.playClick();
    });
  });
}
