/* ==========================================================================
   ARCADE.EXE - RETRO ARCADE GAMING HUB (SNAKE.EXE & FOOTBALL.EXE)
   ========================================================================== */

import { SnakeGame } from './games/snake.js';
import { FootballGame } from './games/football.js';
import { SoundFX } from './sound-fx.js';
import { WindowManager } from './window-manager.js';

let snakeInstance = null;
let footballInstance = null;
let currentTab = 'snake';

export function initArcade() {
  const arcadeWindow = document.getElementById('arcade-window');
  if (!arcadeWindow) return;

  const snakeCanvas = document.getElementById('snake-canvas');
  const snakeScore = document.getElementById('snake-score');
  const snakeHighScore = document.getElementById('snake-high-score');
  const snakeStatus = document.getElementById('snake-status');

  const footballCanvas = document.getElementById('football-canvas');
  const footballScore = document.getElementById('football-score');
  const footballTimer = document.getElementById('football-timer');
  const footballStatus = document.getElementById('football-status');

  if (snakeCanvas) {
    snakeInstance = new SnakeGame(snakeCanvas, snakeScore, snakeHighScore, snakeStatus);
    snakeInstance.draw();
  }

  if (footballCanvas) {
    footballInstance = new FootballGame(footballCanvas, footballScore, footballTimer, footballStatus);
    footballInstance.draw();
  }

  // Tab switching buttons
  const tabButtons = arcadeWindow.querySelectorAll('[data-arcade-tab]');
  const snakePanel = document.getElementById('arcade-snake-panel');
  const footballPanel = document.getElementById('arcade-football-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.arcadeTab;
      currentTab = tab;
      SoundFX.playClick();

      tabButtons.forEach(b => b.classList.toggle('active', b === btn));

      if (tab === 'snake') {
        if (snakePanel) snakePanel.style.display = 'block';
        if (footballPanel) footballPanel.style.display = 'none';
        if (footballInstance) footballInstance.endMatch();
        if (snakeInstance) snakeInstance.draw();
      } else if (tab === 'football') {
        if (snakePanel) snakePanel.style.display = 'none';
        if (footballPanel) footballPanel.style.display = 'block';
        if (snakeInstance) snakeInstance.stop();
        if (footballInstance) footballInstance.draw();
      }
    });
  });

  // Game control restart buttons
  const snakeRestartBtn = document.getElementById('snake-restart-btn');
  if (snakeRestartBtn) {
    snakeRestartBtn.addEventListener('click', () => {
      SoundFX.playClick();
      if (snakeInstance) snakeInstance.start();
    });
  }

  const footballRestartBtn = document.getElementById('football-restart-btn');
  if (footballRestartBtn) {
    footballRestartBtn.addEventListener('click', () => {
      SoundFX.playClick();
      if (footballInstance) footballInstance.start();
    });
  }

  const footballPauseBtn = document.getElementById('football-pause-btn');
  if (footballPauseBtn) {
    footballPauseBtn.addEventListener('click', () => {
      SoundFX.playClick();
      if (footballInstance) {
        footballInstance.togglePause();
        footballPauseBtn.textContent = footballInstance.isPaused ? '▶ Reanudar' : '⏸ Pausar';
      }
    });
  }

  const footballEndBtn = document.getElementById('football-end-btn');
  if (footballEndBtn) {
    footballEndBtn.addEventListener('click', () => {
      SoundFX.playClick();
      if (footballInstance) {
        footballInstance.endMatch();
        if (footballPauseBtn) footballPauseBtn.textContent = '⏸ Pausar';
      }
    });
  }

  // Register in WindowManager
  WindowManager.registerWindow(arcadeWindow);
}

export function openArcade(game = 'snake') {
  const arcadeWindow = document.getElementById('arcade-window');
  if (!arcadeWindow) return;

  WindowManager.openWindow(arcadeWindow.dataset.winId || arcadeWindow.id);

  // Trigger tab if requested
  const targetTabBtn = arcadeWindow.querySelector(`[data-arcade-tab="${game}"]`);
  if (targetTabBtn) {
    targetTabBtn.click();
  }
}
