/* ==========================================================================
   APP.JS - MAIN RETRO OS INITIALIZER & SYSTEM ORCHESTRATOR
   ========================================================================== */

import { SoundFX } from './sound-fx.js';
import { initBootScreen } from './boot-screen.js';
import { WindowManager } from './window-manager.js';
import { initTerminal } from './terminal.js';
import { initProjectFilters } from './filters.js';
import { initCassetteDeck } from './cassette.js';
import { initPegboard } from './pegboard.js';
import { initProjectModal } from './project-modal.js';
import { initArcade } from './arcade.js';
import { initSystemLogs } from './system-logs.js';
import { initTaskbar } from './taskbar.js';
import { initI18n } from './i18n.js';
import { initContactForm } from './contact-form.js';
import { initGuestbook } from './guestbook.js';
import { initAdminPanel } from './admin.js';
import { BackendClient } from './backend-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Audio Engine & Boot Screen
  SoundFX.init();
  initBootScreen();

  // 2. Initialize Window Manager
  WindowManager.init();

  // 3. Initialize Interactive Features
  initTerminal();
  initProjectFilters();
  initCassetteDeck();
  initPegboard();
  initProjectModal();
  initArcade();
  initSystemLogs();
  initAdminPanel();
  initTaskbar();
  initI18n();
  initContactForm();
  initGuestbook();

  // 5. Initialize Desktop Shortcut Handlers & Telemetry Widget
  const arcadeShortcut = document.getElementById('desktop-shortcut-arcade');
  if (arcadeShortcut) {
    arcadeShortcut.addEventListener('click', (e) => {
      e.preventDefault();
      SoundFX.playClick();
      WindowManager.open('arcade-window');
    });
  }

  const logsShortcut = document.getElementById('desktop-shortcut-logs');
  if (logsShortcut) {
    logsShortcut.addEventListener('click', (e) => {
      e.preventDefault();
      SoundFX.playClick();
      WindowManager.open('system-logs-window');
    });
  }

  const cvShortcut = document.getElementById('desktop-shortcut-cv');
  if (cvShortcut) {
    cvShortcut.addEventListener('click', async (e) => {
      e.preventDefault();
      SoundFX.playClick();

      let cvUrl = './CV_Damian_Alexander_Aceves_Navarrete.pdf';
      try {
        const cfg = await BackendClient.getConfig();
        if (cfg && cfg.cvUrl) {
          cvUrl = cfg.cvUrl;
        }
      } catch (err) {
        // Fallback to default
      }

      // 1. Open for visual inspection
      window.open(cvUrl, '_blank');

      // 2. Trigger automatic download
      const downloadLink = document.createElement('a');
      downloadLink.href = cvUrl;
      downloadLink.download = 'CV_John_Franklin_Mejia.pdf';
      downloadLink.target = '_blank';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // 3. Scroll to profile description
      const sobreMi = document.getElementById('sobre-mi');
      if (sobreMi) {
        sobreMi.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const descWin = sobreMi.querySelector('.description-window');
        if (descWin) {
          descWin.classList.add('window-opening');
          setTimeout(() => descWin.classList.remove('window-opening'), 600);
        }
      }
    });
  }

  const adminShortcut = document.getElementById('desktop-shortcut-admin');
  if (adminShortcut) {
    adminShortcut.addEventListener('click', (e) => {
      e.preventDefault();
      SoundFX.playClick();
      WindowManager.open('admin-window');
    });
  }

  const trashShortcut = document.getElementById('desktop-shortcut-trash');
  if (trashShortcut) {
    trashShortcut.addEventListener('click', (e) => {
      e.preventDefault();
      SoundFX.playClick();
      alert('RECYCLE.BIN [Papelera de Reciclaje]\n\nEspacio ocupado: 0 bytes (0 archivos)\nEl sistema está limpio y completamente optimizado.');
    });
  }

  const statusWidgetToggle = document.getElementById('status-widget-toggle');
  const statusWidgetContent = document.getElementById('status-widget-content');
  if (statusWidgetToggle && statusWidgetContent) {
    statusWidgetToggle.addEventListener('click', () => {
      statusWidgetContent.classList.toggle('collapsed');
      statusWidgetToggle.textContent = statusWidgetContent.classList.contains('collapsed') ? '□' : '_';
    });
  }

  // Live Retro Telemetry Fluctuation
  const cpuMeter = document.getElementById('status-cpu-meter');
  const cpuVal = document.getElementById('status-cpu-val');
  const memMeter = document.getElementById('status-mem-meter');
  const memVal = document.getElementById('status-mem-val');

  if (cpuMeter && cpuVal && memMeter && memVal) {
    setInterval(() => {
      const cpu = Math.floor(45 + Math.random() * 25);
      const mem = Math.floor(65 + Math.random() * 12);
      const cpuFilled = Math.round(cpu / 10);
      const memFilled = Math.round(mem / 10);
      cpuMeter.textContent = '█'.repeat(cpuFilled) + '░'.repeat(10 - cpuFilled);
      cpuVal.textContent = `${cpu}%`;
      memMeter.textContent = '█'.repeat(memFilled) + '░'.repeat(10 - memFilled);
      memVal.textContent = `${mem}%`;
    }, 4000);
  }

  // 7. Mobile Hamburger Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');

  if (mobileMenuBtn && mobileNavDropdown) {
    // Toggle menu open/close
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDropdown.classList.contains('open');
      mobileNavDropdown.classList.toggle('open', !isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileNavDropdown.setAttribute('aria-hidden', String(isOpen));
      SoundFX.playClick();
    });

    // Close when a link is clicked
    mobileNavDropdown.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDropdown.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNavDropdown.setAttribute('aria-hidden', 'true');
      });
    });

    // Close when clicking outside the header
    document.addEventListener('click', (e) => {
      const header = document.querySelector('.retro-header-window');
      if (header && !header.contains(e.target) && mobileNavDropdown.classList.contains('open')) {
        mobileNavDropdown.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNavDropdown.setAttribute('aria-hidden', 'true');
      }
    });

    // Sync mobile lang toggle with desktop one (mirror state)
    const mobileLangBtn = document.getElementById('lang-toggle-btn-mobile');
    const desktopLangBtn = document.getElementById('lang-toggle-btn');
    const mobileLangIcon = document.getElementById('lang-icon-mobile');
    const mobileLangLabel = document.getElementById('lang-label-mobile');

    if (mobileLangBtn && desktopLangBtn) {
      // Mirror any click on mobile lang to desktop lang button
      mobileLangBtn.addEventListener('click', () => {
        desktopLangBtn.click();
        // Close the mobile menu after changing language
        mobileNavDropdown.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNavDropdown.setAttribute('aria-hidden', 'true');
      });

      // Observe the desktop lang icon/label to keep mobile in sync
      const syncMobileLang = () => {
        const desktopIcon = document.getElementById('lang-icon');
        const desktopLabel = document.getElementById('lang-label');
        if (desktopIcon && mobileLangIcon) mobileLangIcon.src = desktopIcon.src;
        if (desktopLabel && mobileLangLabel) mobileLangLabel.textContent = desktopLabel.textContent;
      };

      // Watch for changes on the desktop lang label
      const langObserver = new MutationObserver(syncMobileLang);
      const desktopLangLabel = document.getElementById('lang-label');
      if (desktopLangLabel) {
        langObserver.observe(desktopLangLabel, { childList: true, characterData: true, subtree: true });
      }
    }
  }

  // 8. Register visit in local backend
  try {
    const visitRes = await BackendClient.registerVisit();
    const visitorBadge = document.getElementById('visitor-count-badge');
    if (visitorBadge && visitRes && visitRes.visits) {
      visitorBadge.textContent = `VISITANTE #${String(visitRes.visits).padStart(6, '0')}`;
    }
  } catch {
    // Offline mode
  }
});
