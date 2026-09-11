/* ==========================================================================
   BACKEND CLIENT - PORTFOLIO.EXE API CONNECTOR
   ========================================================================== */

export function getApiBase() {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (window.__API_BASE__) return window.__API_BASE__.replace(/\/$/, '');
  if (window.location.hostname.endsWith('github.io')) {
    return 'https://portafolio-mejia-api.onrender.com';
  }
  if (window.location.port === '3000' || (window.location.protocol.startsWith('http') && window.location.port === '')) {
    return '';
  }
  return 'http://localhost:3000';
}

const API_BASE = getApiBase();

export function resolveAssetUrl(value) {
  if (!value || value.startsWith('data:') || /^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_BASE}${value}`;
  return value;
}

export const BackendClient = {
  // --- STATS & TELEMETRY ---
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/api/system/stats`);
      return await res.json();
    } catch (err) {
      console.warn('Backend stats offline, using fallback data.', err);
      return { ok: false, data: { totalVisits: 1420, totalMessages: 0, totalGuestbook: 2 } };
    }
  },

  async registerVisit() {
    try {
      const res = await fetch(`${API_BASE}/api/system/visit`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      return { ok: false, visits: 1420 };
    }
  },

  async getSysInfo() {
    try {
      const res = await fetch(`${API_BASE}/api/system/sysinfo`);
      return await res.json();
    } catch (err) {
      return { ok: false, error: 'Servidor no disponible' };
    }
  },

  async executeTerminalCommand(command) {
    try {
      const res = await fetch(`${API_BASE}/api/system/terminal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      return await res.json();
    } catch (err) {
      return { ok: false, error: 'Error de conexión con el backend.' };
    }
  },

  // --- CONTACT FORM ---
  async sendContactMessage({ name, email, subject, message }) {
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      return await res.json();
    } catch (err) {
      return { ok: false, error: 'No se pudo conectar con el servidor para enviar el mensaje.' };
    }
  },

  // --- GUESTBOOK ---
  async getGuestbookEntries() {
    try {
      const res = await fetch(`${API_BASE}/api/guestbook`);
      return await res.json();
    } catch (err) {
      return { ok: false, data: [] };
    }
  },

  async signGuestbook({ name, avatar, badge, message }) {
    try {
      const res = await fetch(`${API_BASE}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar, badge, message })
      });
      return await res.json();
    } catch (err) {
      return { ok: false, error: 'No se pudo guardar la firma en el servidor.' };
    }
  },

  async likeGuestbookEntry(id) {
    try {
      const res = await fetch(`${API_BASE}/api/guestbook/${id}/like`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      return { ok: false };
    }
  }
};
