import { Router } from 'express';
import os from 'os';
import { db } from '../db.js';

const router = Router();

// GET /api/stats - Contador de visitas y métricas del portafolio
router.get('/stats', (req, res) => {
  try {
    const stats = db.getStats();
    return res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al consultar estadísticas.' });
  }
});

// POST /api/visit - Incrementa contador de visitas al entrar
router.post('/visit', (req, res) => {
  try {
    const count = db.incrementVisits();
    return res.json({
      ok: true,
      visits: count
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al registrar visita.' });
  }
});

// GET /api/sysinfo - Métricas del sistema en vivo para la terminal
router.get('/sysinfo', (req, res) => {
  try {
    const totalMemMB = Math.round(os.totalmem() / (1024 * 1024));
    const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
    const usedMemMB = totalMemMB - freeMemMB;
    const cpus = os.cpus();
    const uptimeSec = Math.floor(os.uptime());
    const appUptimeSec = Math.floor(process.uptime());

    return res.json({
      ok: true,
      system: {
        platform: os.platform(),
        architecture: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        nodeVersion: process.version,
        cpuModel: cpus.length > 0 ? cpus[0].model : 'Generic CPU',
        cpuCores: cpus.length,
        memory: {
          totalMB: totalMemMB,
          usedMB: usedMemMB,
          freeMB: freeMemMB,
          usagePercent: ((usedMemMB / totalMemMB) * 100).toFixed(1)
        },
        uptime: {
          systemSeconds: uptimeSec,
          serverSeconds: appUptimeSec,
          formatted: `${Math.floor(appUptimeSec / 3600)}h ${Math.floor((appUptimeSec % 3600) / 60)}m ${appUptimeSec % 60}s`
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error al consultar información del sistema.' });
  }
});

// POST /api/terminal - Ejecución de comandos del backend en la terminal retro
router.post('/terminal', (req, res) => {
  try {
    const { command } = req.body;
    const cmd = (command || '').trim().toLowerCase();
    db.incrementCommands();

    switch (cmd) {
      case 'sysinfo':
      case 'system':
      case 'neofetch': {
        const totalMemMB = Math.round(os.totalmem() / (1024 * 1024));
        const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
        const usedMemMB = totalMemMB - freeMemMB;
        const uptimeSec = Math.floor(process.uptime());
        const stats = db.getStats();

        const output = [
          '=== SERVER SYSTEM TELEMETRY (LIVE NODE.JS) ===',
          `OS: ${os.type()} ${os.release()} (${os.arch()})`,
          `Node Runtime: ${process.version}`,
          `CPU Cores: ${os.cpus().length}x ${os.cpus()[0]?.model || 'Standard CPU'}`,
          `RAM Memory: ${usedMemMB} MB / ${totalMemMB} MB (${((usedMemMB / totalMemMB) * 100).toFixed(1)}% in use)`,
          `Server Uptime: ${Math.floor(uptimeSec / 60)} min ${uptimeSec % 60} sec`,
          `Total Portfolio Visits: ${stats.totalVisits}`,
          `Guestbook Signatures: ${stats.totalGuestbook}`,
          `Messages in Inbox: ${stats.totalMessages}`
        ];
        return res.json({ ok: true, output });
      }

      case 'ping': {
        return res.json({
          ok: true,
          output: [
            'PING portfolio.server (127.0.0.1): 56 data bytes',
            '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.42 ms',
            '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.38 ms',
            '--- 127.0.0.1 ping statistics ---',
            '2 packets transmitted, 2 packets received, 0.0% packet loss',
            'STATUS: BACKEND ONLINE AND OPERATIONAL [OK]'
          ]
        });
      }

      case 'db status':
      case 'db': {
        const stats = db.getStats();
        return res.json({
          ok: true,
          output: [
            '=== DATABASE STATUS (PERSISTENT JSON ENGINE) ===',
            'Engine: Local Atomic Storage',
            `Registered Visitors: ${stats.totalVisits}`,
            `Contact Messages: ${stats.totalMessages}`,
            `Guestbook Posts: ${stats.totalGuestbook}`,
            `Commands Executed: ${stats.commandsExecuted}`,
            'Database Health: OPTIMAL [OK]'
          ]
        });
      }

      default:
        return res.json({
          ok: false,
          error: `Comando '${command}' no reconocido en el backend. Escribe 'help' para ver los comandos disponibles.`
        });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, error: 'Error procesando comando.' });
  }
});

export default router;
