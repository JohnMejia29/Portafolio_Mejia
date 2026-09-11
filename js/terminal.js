/* ==========================================================================
   TERMINAL INTERACTIVA - REAL RETRO LINUX/BASH TERMINAL
   Supports Interactive Input, Command History (↑/↓), Autocomplete,
   and System Command Execution (help, about, projects, skills, games, etc.)
   ========================================================================== */

import { SoundFX } from './sound-fx.js';
import { WindowManager } from './window-manager.js';
import { openArcade } from './arcade.js';
import { openSystemLogs } from './system-logs.js';
import { openAdminPanel } from './admin.js';

const BANNER = `
==================================================
  PORTFOLIO.EXE [Linux 6.8.0-portfolio-x86_64]
  Type 'help' to display available system commands.
==================================================
`;

const COMMANDS = {
  help: `
AVAILABLE COMMANDS:
  about       - Open USER_PROFILE.SYS (About me)
  projects    - Open PROJECTS.EXE (Portfolio projects)
  skills      - Open TECHNOLOGIES.EXE (Tech stack)
  experience  - Open EXPERIENCE.LOG (Career & Studies)
  contact     - Open CONTACT.EXE (Get in touch)
  games       - Open ARCADE.EXE (Snake & Football)
  logs        - Open SYSTEM_LOGS.EXE (Server activity)
  admin       - Open ADMIN_CONTROL_PANEL.EXE (Portfolio CMS)
  cv          - Download Curriculum Vitae PDF
  clear       - Clear terminal screen
  help        - Show this help menu
`,
  about: 'Opening USER_PROFILE.SYS...',
  projects: `
PORTFOLIO PROJECTS (PROJECTS.EXE):
  [01] COLEGIO_JESUS_DIVINO_MAESTRO.EXE - Plataforma Académica & Aula Virtual (https://www.colegiojesusdivinomaestro.com/)
  [02] SISTEMA_POS_MOVIL.EXE             - Punto de Venta Móvil & Comprobantes
  [03] SISTEMA_MINIMARKET.EXE            - Control Comercial, Inventario & Ventas
  [04] SISTEMA_RESTAURANTE.EXE           - Comandera Digital & Pantalla Cocina KDS
  [05] SISTEMA_HOTEL.EXE                 - Gestión Hotelera & Reservas PMS
  [06] SISTEMA_GYM.EXE                   - Control de Membresías & Socios
  [07] SISTEMA_PANADERIA.EXE             - Costeo de Recetas & Producción
  [08] GASTO.EXE                         - App Móvil Finanzas Offline-First
`,
  skills: 'Opening TECHNOLOGIES.EXE...',
  experience: 'Opening EXPERIENCE_AND_EDUCATION.LOG...',
  contact: 'Opening CONTACT.EXE...',
  games: 'Opening ARCADE.EXE [SNAKE.EXE / FOOTBALL.EXE]...',
  logs: 'Opening SYSTEM_LOGS.EXE...',
  admin: 'Opening ADMIN_CONTROL_PANEL.EXE [PORTFOLIO CMS]...',
  cv: 'Initiating CV download sequence...'
};

export function initTerminal() {
  const terminalEl = document.getElementById('terminal-content');
  if (!terminalEl) return;

  terminalEl.innerHTML = '';
  const history = [];
  let historyIdx = -1;

  // Output container
  const outputEl = document.createElement('div');
  outputEl.className = 'terminal-output';
  outputEl.innerHTML = `<pre class="terminal-banner" style="color: #4ade80; margin: 0; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.4;">${BANNER}</pre>`;
  terminalEl.appendChild(outputEl);

  // Active prompt line
  const promptLine = document.createElement('div');
  promptLine.className = 'terminal-input-line';
  promptLine.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 8px;';
  promptLine.innerHTML = `
    <span style="color: #4ade80; font-weight: bold; font-family: var(--font-mono); font-size: 0.88rem; white-space: nowrap;">john@portfolio:~$</span>
    <input type="text" id="terminal-real-input" autocomplete="off" spellcheck="false" style="flex: 1; background: transparent; border: none; outline: none; color: #f0fdf4; font-family: var(--font-mono); font-size: 0.88rem; caret-color: #38ef7d; width: 100%;">
  `;
  terminalEl.appendChild(promptLine);

  const inputEl = promptLine.querySelector('#terminal-real-input');

  // Focus input on terminal window click
  terminalEl.addEventListener('click', () => {
    inputEl.focus();
  });

  inputEl.addEventListener('keydown', (e) => {
    SoundFX.playKey();

    if (e.key === 'Enter') {
      const cmdRaw = inputEl.value.trim();
      const cmd = cmdRaw.toLowerCase();
      inputEl.value = '';

      if (cmdRaw.length > 0) {
        history.push(cmdRaw);
        historyIdx = history.length;
      }

      // Print command line
      const executedLine = document.createElement('div');
      executedLine.style.cssText = 'display: flex; gap: 8px; margin-top: 4px; font-family: var(--font-mono); font-size: 0.88rem;';
      executedLine.innerHTML = `
        <span style="color: #4ade80; font-weight: bold;">john@portfolio:~$</span>
        <span style="color: #f1f5f9;">${cmdRaw}</span>
      `;
      outputEl.appendChild(executedLine);

      // Execute command
      executeCommand(cmd, outputEl);
      terminalEl.scrollTop = terminalEl.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIdx > 0) {
        historyIdx--;
        inputEl.value = history[historyIdx] || '';
        e.preventDefault();
      }
    } else if (e.key === 'ArrowDown') {
      if (history.length > 0 && historyIdx < history.length - 1) {
        historyIdx++;
        inputEl.value = history[historyIdx] || '';
        e.preventDefault();
      } else {
        historyIdx = history.length;
        inputEl.value = '';
        e.preventDefault();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete
      const val = inputEl.value.trim().toLowerCase();
      if (val) {
        const matches = Object.keys(COMMANDS).filter(c => c.startsWith(val));
        if (matches.length === 1) {
          inputEl.value = matches[0];
        }
      }
    }
  });

  function executeCommand(cmd, container) {
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'font-family: var(--font-mono); font-size: 0.85rem; margin: 4px 0 8px 0; color: #cbd5e1;';

    if (!cmd) return;

    if (cmd === 'clear') {
      outputEl.innerHTML = '';
      return;
    }

    if (COMMANDS[cmd]) {
      resultDiv.innerHTML = `<pre style="margin: 0; font-family: var(--font-mono); color: #38ef7d; white-space: pre-wrap;">${COMMANDS[cmd]}</pre>`;
      container.appendChild(resultDiv);

      // Trigger respective system action
      if (cmd === 'about') {
        const aboutSec = document.getElementById('sobre-mi');
        if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === 'projects') {
        const projSec = document.getElementById('proyectos');
        if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === 'skills') {
        const stackSec = document.getElementById('stack');
        if (stackSec) stackSec.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === 'experience') {
        const aboutSec = document.getElementById('sobre-mi');
        if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === 'contact') {
        const contactSec = document.getElementById('contacto');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === 'games') {
        openArcade('snake');
      } else if (cmd === 'logs') {
        openSystemLogs();
      } else if (cmd === 'admin') {
        openAdminPanel();
      } else if (cmd === 'cv') {
        window.open('./CV_Damian_Alexander_Aceves_Navarrete.pdf', '_blank');
      }
    } else {
      resultDiv.innerHTML = `<span style="color: #f87171;">bash: command not found: ${cmd}. Type <strong style="color: #4ade80;">help</strong> for list of commands.</span>`;
      container.appendChild(resultDiv);
    }
  }
}
