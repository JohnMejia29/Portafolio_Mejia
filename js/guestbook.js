/* ==========================================================================
   GUESTBOOK (LIBRO_DE_VISITAS.EXE) - RETRO SIGNATURE SYSTEM
   ========================================================================== */

import { BackendClient } from './backend-client.js';

const AVATAR_SVGS = {
  terminal: '<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  code: '<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  server: '<svg class="icon-svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
  database: '<svg class="icon-svg" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  cpu: '<svg class="icon-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>'
};

export function initGuestbook() {
  const container = document.getElementById('guestbook-entries-list');
  const form = document.getElementById('guestbook-form');
  const avatarButtons = document.querySelectorAll('.avatar-select-btn');
  const avatarInput = document.getElementById('guestbook-avatar-val');
  const statusBox = document.getElementById('guestbook-status');

  // Handle avatar picker
  if (avatarButtons && avatarInput) {
    avatarButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        avatarButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        avatarInput.value = btn.getAttribute('data-avatar') || 'terminal';
      });
    });
  }

  // Load entries
  async function loadEntries() {
    if (!container) return;
    container.innerHTML = '<div class="guestbook-loading">Cargando firmas del servidor...</div>';

    const res = await BackendClient.getGuestbookEntries();
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      container.innerHTML = '';
      res.data.forEach(entry => {
        const card = createEntryElement(entry);
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<div class="guestbook-empty">Aún no hay firmas. Sé el primero en firmar el libro de visitas.</div>';
    }
  }

  function getAvatarSvg(avatarKey) {
    return AVATAR_SVGS[avatarKey] || AVATAR_SVGS.terminal;
  }

  function createEntryElement(entry) {
    const el = document.createElement('div');
    el.className = 'guestbook-entry-card';
    el.id = `entry-${entry.id}`;

    const dateStr = new Date(entry.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    el.innerHTML = `
      <div class="entry-header">
        <div class="entry-user">
          <span class="entry-avatar">${getAvatarSvg(entry.avatar)}</span>
          <div>
            <strong class="entry-name">${escapeHtml(entry.name)}</strong>
            <span class="entry-badge">${escapeHtml(entry.badge || 'Dev')}</span>
          </div>
        </div>
        <span class="entry-date">${dateStr}</span>
      </div>
      <p class="entry-message">${escapeHtml(entry.message)}</p>
      <div class="entry-footer">
        <button class="retro-like-btn" data-id="${entry.id}">
          <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          <span class="like-count">${entry.likes || 0}</span>
        </button>
      </div>
    `;

    const likeBtn = el.querySelector('.retro-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        const id = likeBtn.getAttribute('data-id');
        const updated = await BackendClient.likeGuestbookEntry(id);
        if (updated && updated.ok) {
          const countEl = el.querySelector('.like-count');
          if (countEl) countEl.textContent = updated.data.likes;
          likeBtn.classList.add('liked');
        }
      });
    }

    return el;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guestbook-name');
      const badgeInput = document.getElementById('guestbook-badge');
      const msgInput = document.getElementById('guestbook-message');
      const submitBtn = document.getElementById('guestbook-submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const badge = badgeInput ? badgeInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';
      const avatar = avatarInput ? avatarInput.value : 'terminal';

      if (!message) {
        if (statusBox) {
          statusBox.className = 'contact-status-box status-error';
          statusBox.textContent = 'Por favor escribe un mensaje para firmar.';
          statusBox.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> GUARDANDO...';
      }

      const res = await BackendClient.signGuestbook({ name, avatar, badge, message });

      if (res.ok && res.data) {
        if (statusBox) {
          statusBox.className = 'contact-status-box status-success';
          statusBox.textContent = '¡Firma guardada con éxito en el servidor!';
          statusBox.style.display = 'block';
        }
        if (msgInput) msgInput.value = '';
        if (nameInput) nameInput.value = '';
        
        // Prepend new entry
        const newEl = createEntryElement(res.data);
        const emptyMsg = container.querySelector('.guestbook-empty');
        if (emptyMsg) emptyMsg.remove();
        container.insertBefore(newEl, container.firstChild);
      } else {
        if (statusBox) {
          statusBox.className = 'contact-status-box status-error';
          statusBox.textContent = res.error || 'Error al guardar firma.';
          statusBox.style.display = 'block';
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> FIRMAR LIBRO';
      }
    });
  }

  loadEntries();
}
