/* ==========================================================================
   WINDOW MANAGER - REAL RETRO DESKTOP OS WINDOW CONTROLLER
   Provides Drag-and-drop, Minimize to Taskbar, Maximize/Restore, Close,
   Z-Index Focus, and Windows 95 Smooth Animations.
   ========================================================================== */

import { SoundFX } from './sound-fx.js';

class WindowManagerClass {
  constructor() {
    this.windows = new Map();
    this.highestZ = 2000;
    this.taskbarContainer = null;
    this.activeWindowId = null;
  }

  init() {
    this.taskbarContainer = document.getElementById('taskbar-windows-container');

    // Register all elements with class .retro-window or [data-window]
    const windowEls = document.querySelectorAll('.retro-window, [data-window]');
    windowEls.forEach((el, index) => {
      this.registerWindow(el, index);
    });

    // Handle global click to unselect if outside
    document.addEventListener('pointerdown', (e) => {
      const win = e.target.closest('.retro-window, [data-window]');
      if (win && win.dataset.winId) {
        this.focusWindow(win.dataset.winId);
      }
    });

    // Keyboard ESC to close active floating window or modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeWindowId) {
        const winData = this.windows.get(this.activeWindowId);
        if (winData && winData.isFloating && !winData.isClosed) {
          this.closeWindow(this.activeWindowId);
        }
      }
    });
  }

  registerWindow(el, defaultIndex = 0) {
    let winId = el.dataset.winId || el.id;
    if (!winId) {
      winId = `win_${defaultIndex}_${Math.random().toString(36).substr(2, 4)}`;
      el.dataset.winId = winId;
    }

    const titleEl = el.querySelector('.titlebar-title, h3, h4');
    const title = el.dataset.winTitle || (titleEl ? titleEl.textContent.trim() : 'VENTANA.EXE');
    const iconImg = el.querySelector('.titlebar-icon img');
    const iconSrc = iconImg ? iconImg.src : './images/icono_windows.webp';

    const isFloating = el.classList.contains('floating-window') || el.dataset.floating === 'true';

    const winData = {
      id: winId,
      el: el,
      title: title,
      iconSrc: iconSrc,
      isMinimized: false,
      isMaximized: false,
      isClosed: el.classList.contains('hidden') || el.hasAttribute('hidden') || el.style.display === 'none',
      isFloating: isFloating,
      originalTransform: '',
      pos: { x: 0, y: 0 },
      dragState: null
    };

    this.windows.set(winId, winData);
    this.setupWindowControls(winData);
    this.setupDraggable(winData);

    // If floating and open, create taskbar tab
    if (isFloating && !winData.isClosed) {
      this.updateTaskbar();
    }

    return winData;
  }

  setupWindowControls(winData) {
    const { el, id } = winData;
    const minBtn = el.querySelector('.btn-minimize, .window-control--minimize');
    const maxBtn = el.querySelector('.btn-maximize, .window-control--maximize');
    const closeBtn = el.querySelector('.btn-close, .window-control--close');

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(id);
      });
    }

    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(id);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(id);
      });
    }

    // Double-click titlebar to maximize/restore
    const titlebar = el.querySelector('.retro-titlebar');
    if (titlebar) {
      titlebar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.titlebar-controls, .window-controls, button')) {
          this.toggleMaximize(id);
        }
      });
    }
  }

  setupDraggable(winData) {
    const { el, id } = winData;
    const titlebar = el.querySelector('.retro-titlebar');
    if (!titlebar) return;

    titlebar.style.cursor = 'grab';

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button, .window-btn, .window-control, a')) return;
      // Don't drag on mobile/touch devices — windows are full-screen there
      if (window.innerWidth <= 860) return;

      this.focusWindow(id);
      if (winData.isMaximized) return; // Don't drag while maximized

      isDragging = true;
      titlebar.style.cursor = 'grabbing';
      el.classList.add('is-dragging');

      const rect = el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      // If in static flow and requested floating drag, convert to fixed positioning
      if (!winData.isFloating && !el.classList.contains('floating-window')) {
        // keep static scrollable or convert to relative transform
      }

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (winData.isFloating) {
        const newLeft = Math.max(0, Math.min(window.innerWidth - 60, initialLeft + dx));
        const newTop = Math.max(0, Math.min(window.innerHeight - 80, initialTop + dy));
        el.style.position = 'fixed';
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
        el.style.margin = '0';
        el.style.transform = 'none';
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      titlebar.style.cursor = 'grab';
      el.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    titlebar.addEventListener('pointerdown', onPointerDown);
  }

  focusWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    this.highestZ += 1;
    winData.el.style.zIndex = this.highestZ;
    this.activeWindowId = id;

    // Update active style on titlebars
    this.windows.forEach((w) => {
      if (w.id === id) {
        w.el.classList.add('window-focused');
        w.el.classList.remove('window-inactive');
      } else {
        w.el.classList.remove('window-focused');
        w.el.classList.add('window-inactive');
      }
    });

    this.updateTaskbar();
  }

  open(id) {
    return this.openWindow(id);
  }

  openWindow(id) {
    let winData = this.windows.get(id);
    if (!winData) {
      for (const [key, w] of this.windows.entries()) {
        if (key === id || w.id === id || w.el.id === id || w.el.dataset.winId === id) {
          winData = w;
          id = key;
          break;
        }
      }
    }
    if (!winData) {
      const directEl = document.getElementById(id) || document.querySelector(`[data-win-id="${id}"]`);
      if (directEl) {
        winData = this.registerWindow(directEl);
        id = winData.id;
      }
    }
    if (!winData) return;

    if (winData.isFloating && window.innerWidth <= 860) {
      this.setMobileBackgroundWindowsHidden(true);
      this.windows.forEach((otherWin) => {
        if (otherWin.id === winData.id || !otherWin.isFloating || otherWin.isClosed) return;
        otherWin.el.classList.remove('window-opening', 'window-focused', 'window-inactive', 'is-minimized');
        otherWin.el.style.display = 'none';
        otherWin.isClosed = true;
        otherWin.isMinimized = false;
      });
    }

    winData.isClosed = false;
    winData.isMinimized = false;
    winData.el.removeAttribute('hidden');
    winData.el.style.display = winData.isFloating ? 'flex' : 'block';
    winData.el.classList.remove('hidden', 'is-minimized');
    winData.el.classList.add('window-opening');

    // On mobile: reset any manually-dragged inline position so CSS full-screen takes effect
    if (winData.isFloating && window.innerWidth <= 860) {
      winData.el.style.left = '';
      winData.el.style.top = '';
      winData.el.style.right = '';
      winData.el.style.bottom = '';
      winData.el.style.transform = '';
      winData.el.style.width = '';
      winData.el.style.height = '';
      winData.el.style.margin = '';
    }

    setTimeout(() => {
      winData.el.classList.remove('window-opening');
    }, 200);

    SoundFX.playClick();
    this.focusWindow(id);
    this.updateTaskbar();

    // If section scroll target, scroll smoothly
    if (!winData.isFloating && winData.el.closest('section')) {
      const sec = winData.el.closest('section');
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  closeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    SoundFX.playClose();
    winData.el.classList.add('window-closing');

    setTimeout(() => {
      winData.el.classList.remove('window-closing');
      if (winData.isFloating) {
        winData.el.style.display = 'none';
        winData.isClosed = true;
        this.setMobileBackgroundWindowsHidden(false);
      }
      this.updateTaskbar();
    }, 150);

    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }
  }

  minimizeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    SoundFX.playClose();
    winData.isMinimized = true;
    winData.el.classList.add('is-minimized');

    if (winData.isFloating) {
      winData.el.style.display = 'none';
      this.setMobileBackgroundWindowsHidden(false);
    }

    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }

    this.updateTaskbar();
  }

  setMobileBackgroundWindowsHidden(hidden) {
    if (window.innerWidth > 860) return;
    document.querySelectorAll('.terminal-window').forEach((terminal) => {
      const windowElement = terminal.closest('.retro-window');
      if (windowElement) windowElement.classList.toggle('mobile-overlay-hidden', hidden);
    });
  }

  restoreWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.isMinimized = false;
    winData.el.classList.remove('is-minimized');
    winData.el.style.display = '';

    SoundFX.playClick();
    this.focusWindow(id);
    this.updateTaskbar();
  }

  toggleMaximize(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    SoundFX.playClick();
    winData.isMaximized = !winData.isMaximized;

    if (winData.isMaximized) {
      winData.el.classList.add('is-maximized');
    } else {
      winData.el.classList.remove('is-maximized');
    }

    const maxBtn = winData.el.querySelector('.btn-maximize, .window-control--maximize');
    if (maxBtn) {
      maxBtn.textContent = winData.isMaximized ? '❐' : '□';
    }

    this.focusWindow(id);
  }

  updateTaskbar() {
    if (!this.taskbarContainer) return;
    this.taskbarContainer.innerHTML = '';

    this.windows.forEach((winData) => {
      // Show floating windows or active programs in taskbar
      if (winData.isFloating && !winData.isClosed) {
        const btn = document.createElement('button');
        btn.className = `taskbar-window-btn ${this.activeWindowId === winData.id && !winData.isMinimized ? 'active' : ''}`;
        btn.innerHTML = `
          <img src="${winData.iconSrc}" alt="" width="16" height="16" style="image-rendering: pixelated; vertical-align: middle;">
          <span>${winData.title}</span>
        `;

        btn.addEventListener('click', () => {
          if (winData.isMinimized) {
            this.restoreWindow(winData.id);
          } else if (this.activeWindowId === winData.id) {
            this.minimizeWindow(winData.id);
          } else {
            this.focusWindow(winData.id);
          }
        });

        this.taskbarContainer.appendChild(btn);
      }
    });
  }
}

export const WindowManager = new WindowManagerClass();
