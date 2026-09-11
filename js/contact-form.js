/* ==========================================================================
   CONTACT FORM HANDLER (MENSAJES.EXE)
   ========================================================================== */

import { BackendClient } from './backend-client.js';

export function initContactForm() {
  const form = document.getElementById('retro-contact-form');
  const statusBox = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ENVIANDO A SERVIDOR...';
    }
    showStatus('Transmitiendo mensaje al servidor backend...', 'info');

    try {
      const res = await BackendClient.sendContactMessage({ name, email, subject, message });

      if (res.ok) {
        showStatus('¡MENSAJE ENVIADO! Tu mensaje fue almacenado exitosamente en el servidor.', 'success');
        form.reset();
      } else {
        showStatus(`Error: ${res.error || 'No se pudo enviar el mensaje.'}`, 'error');
      }
    } catch (err) {
      showStatus('Error de conexión con el servidor backend.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> ENVIAR MENSAJE.DAT';
      }
    }
  });

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.className = `contact-status-box status-${type}`;
    statusBox.textContent = msg;
    statusBox.style.display = 'block';
  }
}
