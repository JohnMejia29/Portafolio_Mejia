/* ==========================================================================
   SYSTEM_LOGS.EXE - RETRO SYSTEM EVENT LOG VIEWER
   Displays Real-Time Server Telemetry & Event Logs
   ========================================================================== */

import { BackendClient } from './backend-client.js';
import { WindowManager } from './window-manager.js';
import { SoundFX } from './sound-fx.js';

const STATIC_LOGS = [
  { date: '2026-09-10 11:20:00', type: 'INFO', msg: '✓ PORTFOLIO.EXE BIOS v1.0 inicializado correctamente' },
  { date: '2026-09-10 10:55:12', type: 'SUCCESS', msg: '✓ Módulos de interfaz retro y estilos Windows 95 cargados' },
  { date: '2026-09-09 18:30:00', type: 'INFO', msg: '✓ Nuevo proyecto integrado: GASTO.EXE (React Native / Supabase)' },
  { date: '2026-09-05 14:15:00', type: 'SUCCESS', msg: '✓ Optimización de consultas PostgreSQL y persistencia JSON' },
  { date: '2026-09-01 09:00:00', type: 'SYS', msg: '✓ Backend Express API v1.0 en ejecución en puerto 3000' }
];

export function initSystemLogs() {
  const logsWindow = document.getElementById('system-logs-window');
  if (!logsWindow) return;

  const logsListEl = document.getElementById('system-logs-list');
  const refreshBtn = document.getElementById('system-logs-refresh');
  const statsEl = document.getElementById('system-logs-stats');

  async function loadLogs() {
    if (logsListEl) {
      logsListEl.innerHTML = '<div style="color: #93c5fd; padding: 10px; font-family: var(--font-mono);">[CARGANDO REGISTROS DEL SISTEMA...]</div>';
    }

    try {
      const statsRes = await BackendClient.getStats();
      let liveEntries = [];

      if (statsRes && statsRes.ok && statsRes.data) {
        const d = statsRes.data;
        if (statsEl) {
          statsEl.innerHTML = `UPTIME: <strong>${d.uptimeSeconds || 0}s</strong> | VISITAS: <strong>${d.totalVisits || 0}</strong> | MENSAJES: <strong>${d.totalMessages || 0}</strong> | VISITAS LIBRO: <strong>${d.totalGuestbook || 0}</strong>`;
        }

        liveEntries.push({
          date: new Date().toLocaleTimeString(),
          type: 'LIVE',
          msg: `✓ Sesión activa: ${d.totalVisits} visitas registradas en base de datos local`
        });
      }

      const allLogs = [...liveEntries, ...STATIC_LOGS];
      
      if (logsListEl) {
        logsListEl.innerHTML = allLogs.map(log => `
          <div class="log-row" style="font-family: var(--font-mono); font-size: 0.85rem; padding: 6px 8px; border-bottom: 1px dotted #334155; display: flex; gap: 10px; align-items: baseline;">
            <span style="color: #8dafa4; white-space: nowrap;">[${log.date}]</span>
            <span style="color: ${log.type === 'SUCCESS' ? '#4ade80' : log.type === 'LIVE' ? '#38ef7d' : '#93c5fd'}; font-weight: bold;">[${log.type}]</span>
            <span style="color: #f1f5f9;">${log.msg}</span>
          </div>
        `).join('');
      }
    } catch {
      if (logsListEl) {
        logsListEl.innerHTML = STATIC_LOGS.map(log => `
          <div class="log-row" style="font-family: var(--font-mono); font-size: 0.85rem; padding: 6px 8px; border-bottom: 1px dotted #334155; display: flex; gap: 10px; align-items: baseline;">
            <span style="color: #8dafa4;">[${log.date}]</span>
            <span style="color: #4ade80; font-weight: bold;">[${log.type}]</span>
            <span style="color: #f1f5f9;">${log.msg}</span>
          </div>
        `).join('');
      }
    }
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      SoundFX.playClick();
      loadLogs();
    });
  }

  loadLogs();
  WindowManager.registerWindow(logsWindow);
}

export function openSystemLogs() {
  const logsWindow = document.getElementById('system-logs-window');
  if (!logsWindow) return;
  WindowManager.openWindow(logsWindow.dataset.winId || logsWindow.id);
}
