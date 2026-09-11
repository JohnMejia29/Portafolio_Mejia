/* ==========================================================================
   BOOT SCREEN - RETRO BIOS v1.0 INITIALIZATION SEQUENCE
   Provides Authentic Retro POST Screen and Transitions Smoothly to Desktop
   ========================================================================== */

import { SoundFX } from './sound-fx.js';

export function initBootScreen() {
  const bootOverlay = document.getElementById('boot-screen-overlay');
  if (!bootOverlay) return;

  let finished = false;
  let finishTimer;

  const hideOverlay = () => {
    bootOverlay.classList.add('boot-fade-out');
    bootOverlay.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('portfolio_booted', 'true');
    clearTimeout(finishTimer);
    finishTimer = setTimeout(() => {
      bootOverlay.style.display = 'none';
    }, 400);
  };

  const finishBoot = () => {
    if (finished) return;
    finished = true;
    hideOverlay();
    window.removeEventListener('keydown', skipHandler);
    bootOverlay.removeEventListener('click', skipHandler);
  };

  const skipHandler = () => finishBoot();

  finishTimer = setTimeout(finishBoot, 3000);

  // Check if user already booted in this session to prevent annoyance on refresh
  const bootedBefore = sessionStorage.getItem('portfolio_booted');
  if (bootedBefore) {
    finished = true;
    bootOverlay.style.display = 'none';
    return;
  }

  SoundFX.playBoot();

  const lines = [
    'PORTFOLIO.EXE BIOS v1.0',
    'Copyright (C) 2026 Damian Aceves / Retro Systems',
    '',
    'Checking Memory: 640K System RAM Passed',
    'Detecting Hardware: Retro 90s Display Adapter Found',
    '',
    'Inicializando sistema...',
    '✓ Loading profile (USER_PROFILE.SYS)',
    '✓ Loading projects (PROJECTS.EXE)',
    '✓ Loading skills (TECHNOLOGIES.EXE)',
    '✓ Loading terminal (TERMINAL.EXE)',
    '✓ System ready. Starting PORTFOLIO.EXE...'
  ];

  const consoleEl = document.getElementById('boot-screen-text');
  let lineIdx = 0;

  function printNextLine() {
    if (!consoleEl) return;
    if (lineIdx < lines.length) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'boot-line';
      lineDiv.textContent = lines[lineIdx];
      if (lines[lineIdx].startsWith('✓')) {
        lineDiv.style.color = '#4ade80';
      } else if (lines[lineIdx].startsWith('PORTFOLIO')) {
        lineDiv.style.color = '#fef08a';
        lineDiv.style.fontWeight = 'bold';
      }
      consoleEl.appendChild(lineDiv);
      lineIdx++;
      setTimeout(printNextLine, 45);
    } else {
      setTimeout(finishBoot, 150);
    }
  }

  // Allow clicking or pressing any key to skip immediately
  window.addEventListener('keydown', skipHandler);
  bootOverlay.addEventListener('click', skipHandler);

  printNextLine();
}
