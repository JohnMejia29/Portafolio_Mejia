/* ==========================================================================
   ADMIN_CONTROL_PANEL.EXE - RETRO PORTFOLIO CMS & DASHBOARD
   - Inbox: Received Contact Messages
   - Projects CMS: Create, Edit, Upload Images, Delete Projects
   - Profile & Socials Settings: GitHub, LinkedIn, Email, WhatsApp, Bio
   - Guestbook Moderation
   ========================================================================== */

import { SoundFX } from './sound-fx.js';
import { WindowManager } from './window-manager.js';
import { getApiBase, resolveAssetUrl } from './backend-client.js';

const API_BASE = getApiBase();
let adminToken = sessionStorage.getItem('portfolio_admin_token') || null;

export function initAdminPanel() {
  const adminWin = document.getElementById('admin-window');
  if (!adminWin) return;

  WindowManager.registerWindow(adminWin);
  bindAdminEvents();
}

export function openAdminPanel() {
  const adminWin = document.getElementById('admin-window');
  if (!adminWin) return;

  WindowManager.openWindow(adminWin.dataset.winId || adminWin.id);
  SoundFX.playOpen();

  if (adminToken) {
    showDashboardView();
  } else {
    showLoginView();
  }
}

function showLoginView() {
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  if (loginView) loginView.style.display = 'block';
  if (dashboardView) dashboardView.style.display = 'none';

  const pinInput = document.getElementById('admin-pin-input');
  if (pinInput) {
    pinInput.value = '';
    setTimeout(() => pinInput.focus(), 100);
  }
}

function showDashboardView() {
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  if (loginView) loginView.style.display = 'none';
  if (dashboardView) dashboardView.style.display = 'block';

  // Load initial active tab data
  loadMessages();
  loadProjects();
  loadConfig();
  loadGuestbook();
}

function bindAdminEvents() {
  // Login Form
  const loginForm = document.getElementById('admin-login-form');
  const pinInput = document.getElementById('admin-pin-input');
  const loginMsg = document.getElementById('admin-login-msg');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = pinInput.value.trim();
      if (!pin) return;

      try {
        if (loginMsg) loginMsg.textContent = 'Verificando credenciales...';
        const res = await fetch(`${API_BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        const data = await res.json();

        if (data.ok && data.token) {
          adminToken = data.token;
          sessionStorage.setItem('portfolio_admin_token', adminToken);
          try { SoundFX.playSuccess(); } catch {}
          if (loginMsg) loginMsg.textContent = '¡Acceso concedido!';
          setTimeout(() => showDashboardView(), 300);
        } else {
          try { SoundFX.playGameOver(); } catch {}
          if (loginMsg) loginMsg.textContent = data.error || 'PIN incorrecto';
        }
      } catch (err) {
        console.error('Login error:', err);
        if (loginMsg) loginMsg.textContent = 'Error: ' + (err.message || 'No se pudo conectar');
      }
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminToken = null;
      sessionStorage.removeItem('portfolio_admin_token');
      SoundFX.playClick();
      showLoginView();
    });
  }

  // Navigation Tabs
  const tabButtons = document.querySelectorAll('[data-admin-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.adminTab;
      SoundFX.playClick();

      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.admin-tab-content').forEach(panel => {
        panel.style.display = (panel.id === `admin-tab-${target}`) ? 'block' : 'none';
      });

      if (target === 'inbox') loadMessages();
      if (target === 'projects') loadProjects();
      if (target === 'profile') loadConfig();
      if (target === 'guestbook') loadGuestbook();
    });
  });

  // New Project Button
  const newProjBtn = document.getElementById('admin-new-project-btn');
  if (newProjBtn) {
    newProjBtn.addEventListener('click', () => {
      openProjectEditor(null);
    });
  }

  // Project Editor Form
  const projForm = document.getElementById('admin-project-form');
  if (projForm) {
    projForm.addEventListener('submit', handleSaveProject);
  }

  // Image Upload input preview
  const imgFileInput = document.getElementById('proj-img-file');
  if (imgFileInput) {
    imgFileInput.addEventListener('change', handleImageUploadPreview);
  }

  // Profile Form
  const profileForm = document.getElementById('admin-profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleSaveConfig);
  }

  // Avatar Upload listener
  const avatarFileInput = document.getElementById('cfg-avatar-file');
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', handleAvatarUploadPreview);
  }

  const avatarInput = document.getElementById('cfg-avatar');
  if (avatarInput) {
    avatarInput.addEventListener('input', () => {
      const preview = document.getElementById('cfg-avatar-preview');
      if (preview) preview.src = avatarInput.value.trim() || './images/personaje.webp';
    });
  }

  const avatarResetBtn = document.getElementById('cfg-avatar-reset');
  if (avatarResetBtn) {
    avatarResetBtn.addEventListener('click', () => {
      if (avatarInput) avatarInput.value = './images/personaje.webp';
      const preview = document.getElementById('cfg-avatar-preview');
      if (preview) preview.src = './images/personaje.webp';
      SoundFX.playClick();
    });
  }

  // CV PDF Upload listener
  const cvFileInput = document.getElementById('cfg-cv-file');
  if (cvFileInput) {
    cvFileInput.addEventListener('change', handleCvUpload);
  }

  const cvInput = document.getElementById('cfg-cv');
  if (cvInput) {
    cvInput.addEventListener('input', () => {
      const testLink = document.getElementById('cfg-cv-test-link');
      if (testLink) testLink.href = cvInput.value.trim() || '#';
    });
  }
}

// =============================================================================
// TAB 1: INBOX / MENSAJES RECIBIDOS
// =============================================================================
async function loadMessages() {
  const container = document.getElementById('admin-messages-list');
  const countBadge = document.getElementById('admin-unread-count');
  if (!container) return;

  container.innerHTML = '<div style="padding: 12px; color: #8dafa4;">Cargando mensajes...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/admin/messages`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (!data.ok) {
      container.innerHTML = `<div style="padding: 12px; color: #ff6b6b;">${data.error || 'Error'}</div>`;
      return;
    }

    const messages = data.data || [];
    if (countBadge) countBadge.textContent = data.unread > 0 ? `${data.unread} Nuevos` : '0 Nuevos';

    if (messages.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #8dafa4; font-family: var(--font-mono);">
          <p>📭 No hay mensajes recibidos aún.</p>
          <span style="font-size: 0.85rem;">Los mensajes enviados desde MENSAJE_NUEVO.EXE aparecerán aquí en tiempo real.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => `
      <div class="admin-message-card ${msg.status === 'unread' ? 'unread' : ''}" data-msg-id="${msg.id}" style="background: #102620; border: 1px solid ${msg.status === 'unread' ? '#38ef7d' : '#1e483e'}; padding: 12px; margin-bottom: 10px; border-radius: 2px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
          <div>
            <strong style="color: #f8fafc; font-size: 1rem;">${escapeHtml(msg.name)}</strong>
            <span style="color: #4ade80; font-size: 0.85rem; margin-left: 8px;">&lt;${escapeHtml(msg.email)}&gt;</span>
            ${msg.status === 'unread' ? '<span class="tag-pill" style="background: #166534; color: #86efac; margin-left: 6px; font-size: 0.75rem;">NUEVO</span>' : ''}
          </div>
          <span style="color: #8dafa4; font-size: 0.8rem; font-family: var(--font-mono);">${new Date(msg.createdAt).toLocaleString()}</span>
        </div>
        <div style="color: #fef08a; font-weight: 600; font-size: 0.95rem; margin-bottom: 6px;">
          📌 ${escapeHtml(msg.subject)}
        </div>
        <div style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; white-space: pre-wrap; background: #061511; padding: 8px; border-radius: 2px; border: 1px dashed #175244;">${escapeHtml(msg.message)}</div>
        <div style="display: flex; gap: 8px; margin-top: 10px; justify-content: flex-end;">
          <a href="mailto:${encodeURIComponent(msg.email)}?subject=Re: ${encodeURIComponent(msg.subject)}" class="retro-btn btn-primary" style="padding: 2px 8px; font-size: 0.85rem;">
            ✉ Responder
          </a>
          <button class="retro-btn btn-delete-msg" data-msg-id="${msg.id}" style="padding: 2px 8px; font-size: 0.85rem; color: #ff6b6b;">
            ✕ Eliminar
          </button>
        </div>
      </div>
    `).join('');

    // Bind delete & read actions
    container.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.msgId;
        if (!confirm('¿Eliminar este mensaje?')) return;
        SoundFX.playClick();
        await fetch(`${API_BASE}/api/admin/messages/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        loadMessages();
      });
    });

    // Mark unread as read on click
    container.querySelectorAll('.admin-message-card.unread').forEach(card => {
      card.addEventListener('click', async () => {
        const id = card.dataset.msgId;
        await fetch(`${API_BASE}/api/admin/messages/${id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        card.classList.remove('unread');
        const badge = card.querySelector('.tag-pill');
        if (badge) badge.remove();
      }, { once: true });
    });

  } catch (err) {
    container.innerHTML = '<div style="padding: 12px; color: #ff6b6b;">Error al cargar mensajes.</div>';
  }
}

// =============================================================================
// TAB 2: PROJECTS CMS
// =============================================================================
let currentProjectsList = [];

async function loadProjects() {
  const container = document.getElementById('admin-projects-list');
  if (!container) return;

  container.innerHTML = '<div style="padding: 12px; color: #8dafa4;">Cargando proyectos...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/admin/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (!data.ok) {
      container.innerHTML = `<div style="padding: 12px; color: #ff6b6b;">${data.error}</div>`;
      return;
    }

    currentProjectsList = data.data || [];

    if (currentProjectsList.length === 0) {
      container.innerHTML = '<div style="padding: 16px; color: #8dafa4;">No hay proyectos. ¡Crea uno nuevo!</div>';
      return;
    }

    container.innerHTML = currentProjectsList.map(p => `
      <div style="display: flex; gap: 12px; background: #102620; border: 1px solid #1e483e; padding: 10px; margin-bottom: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${p.cover || './header_icons/proyectos.webp'}" width="48" height="48" style="object-fit: cover; border: 1px solid #286053; border-radius: 2px;">
          <div>
            <strong style="color: #4ade80; font-family: var(--font-pixel); font-size: 1rem;">${escapeHtml(p.exeName || p.id)}</strong>
            <div style="color: #f8fafc; font-size: 0.9rem;">${escapeHtml(p.title)}</div>
            <span class="tag-pill" style="font-size: 0.75rem; background: #175244; color: #a7f3d0;">${p.category === 'movil' ? 'Móvil' : 'Web'}</span>
            <span class="tag-pill" style="font-size: 0.75rem; background: #064e3b; color: #6ee7b7;">${p.status || 'ONLINE'}</span>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="retro-btn btn-primary btn-edit-proj" data-proj-id="${p.id}" style="padding: 4px 8px; font-size: 0.85rem;">
            ✏ Editar
          </button>
          <button class="retro-btn btn-delete-proj" data-proj-id="${p.id}" style="padding: 4px 8px; font-size: 0.85rem; color: #ff6b6b;">
            ✕ Eliminar
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-edit-proj').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.projId;
        const project = currentProjectsList.find(p => p.id === id);
        openProjectEditor(project);
      });
    });

    container.querySelectorAll('.btn-delete-proj').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.projId;
        if (!confirm(`¿Estás seguro de eliminar el proyecto ${id}?`)) return;
        SoundFX.playClick();
        await fetch(`${API_BASE}/api/admin/projects/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        loadProjects();
        refreshPublicProjects();
      });
    });

  } catch (err) {
    container.innerHTML = '<div style="padding: 12px; color: #ff6b6b;">Error al cargar proyectos.</div>';
  }
}

function openProjectEditor(project) {
  const modal = document.getElementById('admin-project-editor-modal');
  if (!modal) return;

  const isEdit = !!project;
  document.getElementById('editor-modal-title').textContent = isEdit ? `EDITAR: ${project.exeName}` : 'CREAR NUEVO PROYECTO';
  document.getElementById('proj-edit-is-new').value = isEdit ? '0' : '1';
  document.getElementById('proj-edit-id').value = isEdit ? project.id : '';
  document.getElementById('proj-edit-id').readOnly = isEdit;
  document.getElementById('proj-edit-title').value = isEdit ? project.title : '';
  document.getElementById('proj-edit-exename').value = isEdit ? project.exeName : '';
  document.getElementById('proj-edit-category').value = isEdit ? project.category : 'web';
  document.getElementById('proj-edit-status').value = isEdit ? (project.status || 'ONLINE') : 'ONLINE';
  document.getElementById('proj-edit-summary').value = isEdit ? project.summary : '';
  document.getElementById('proj-edit-architecture').value = isEdit ? (project.architecture || '') : '';
  const projectImages = isEdit && Array.isArray(project.images) && project.images.length
    ? project.images
    : (isEdit && project.cover ? [project.cover] : []);
  document.getElementById('proj-edit-cover').value = projectImages[0] || '';
  document.getElementById('proj-edit-images').value = JSON.stringify(projectImages);
  renderProjectImagePreviews(projectImages);
  document.getElementById('proj-edit-features').value = isEdit && Array.isArray(project.features) ? project.features.join('\n') : '';
  document.getElementById('proj-edit-stack').value = isEdit && Array.isArray(project.stack) ? project.stack.map(s => typeof s === 'string' ? s : s.name).join(', ') : '';
  document.getElementById('proj-edit-demo').value = isEdit ? (project.demoUrl || '') : '';
  document.getElementById('proj-edit-repo').value = isEdit ? (project.repoUrl || '') : '';

  modal.style.display = 'flex';
  SoundFX.playOpen();

  const closeBtn = document.getElementById('proj-editor-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      SoundFX.playClose();
    };
  }
}

function renderProjectImagePreviews(images) {
  const previewList = document.getElementById('proj-cover-preview-list');
  if (!previewList) return;
  previewList.innerHTML = images.map((src, index) => `
    <img src="${resolveAssetUrl(src)}" alt="Imagen ${index + 1}" style="width: 96px; height: 64px; object-fit: cover; border: 1px solid #38ef7d;">
  `).join('');
}

async function uploadProjectImage(file, index) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      imageBase64: base64,
      filename: `proj_${Date.now()}_${index}`
    })
  });
  const data = await res.json();
  if (!data.ok || !data.url) throw new Error(data.error || 'No se pudo subir la imagen');
  return data.url;
}

async function handleImageUploadPreview(e) {
  const files = [...e.target.files];
  if (!files.length) return;

  const currentImages = JSON.parse(document.getElementById('proj-edit-images').value || '[]');
  try {
    const uploadedImages = await Promise.all(files.map((file, index) => uploadProjectImage(file, index)));
    const images = [...currentImages, ...uploadedImages];
    document.getElementById('proj-edit-images').value = JSON.stringify(images);
    document.getElementById('proj-edit-cover').value = images[0] || '';
    renderProjectImagePreviews(images);
    SoundFX.playSuccess();
  } catch (err) {
    console.error('Error subiendo imágenes:', err);
    alert('No se pudieron subir una o más imágenes.');
  } finally {
    e.target.value = '';
  }
}

async function handleSaveProject(e) {
  e.preventDefault();
  const isNew = document.getElementById('proj-edit-is-new').value === '1';
  const id = document.getElementById('proj-edit-id').value.trim();
  const title = document.getElementById('proj-edit-title').value.trim();
  const exeName = document.getElementById('proj-edit-exename').value.trim() || (id.toUpperCase() + '.EXE');
  const category = document.getElementById('proj-edit-category').value;
  const status = document.getElementById('proj-edit-status').value;
  const summary = document.getElementById('proj-edit-summary').value.trim();
  const architecture = document.getElementById('proj-edit-architecture').value.trim();
  const cover = document.getElementById('proj-edit-cover').value.trim();
  const images = JSON.parse(document.getElementById('proj-edit-images').value || '[]');
  const featuresRaw = document.getElementById('proj-edit-features').value;
  const stackRaw = document.getElementById('proj-edit-stack').value;
  const demoUrl = document.getElementById('proj-edit-demo').value.trim();
  const repoUrl = document.getElementById('proj-edit-repo').value.trim();

  const features = featuresRaw.split('\n').map(f => f.trim().replace(/^[•✓-]\s*/, '')).filter(Boolean);
  const stack = stackRaw.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
    name,
    icon: './stack_icons/node.svg'
  }));

  const payload = {
    id,
    title,
    exeName,
    category,
    status,
    summary,
    architecture,
    cover,
    images: images.length ? images : (cover ? [cover] : []),
    features,
    stack,
    demoUrl,
    repoUrl
  };

  try {
    const url = isNew ? `${API_BASE}/api/admin/projects` : `${API_BASE}/api/admin/projects/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.ok) {
      SoundFX.playSuccess();
      document.getElementById('admin-project-editor-modal').style.display = 'none';
      loadProjects();
      refreshPublicProjects();
      alert('¡Proyecto guardado con éxito!');
    } else {
      SoundFX.playGameOver();
      alert(data.error || 'Error al guardar proyecto');
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
  }
}

// =============================================================================
// TAB 3: PROFILE, AVATAR & CV SETTINGS
// =============================================================================
async function handleAvatarUploadPreview(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const base64 = evt.target.result;
    const preview = document.getElementById('cfg-avatar-preview');
    if (preview) preview.src = base64;

    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          imageBase64: base64,
          filename: 'avatar_' + Date.now()
        })
      });
      const data = await res.json();
      if (data.ok && data.url) {
        document.getElementById('cfg-avatar').value = data.url;
        SoundFX.playSuccess();
      }
    } catch (err) {
      console.error('Error subiendo foto de perfil:', err);
    }
  };
  reader.readAsDataURL(file);
}

async function handleCvUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const base64 = evt.target.result;
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          fileBase64: base64,
          filename: 'CV_John_Franklin_Mejia_' + Date.now()
        })
      });
      const data = await res.json();
      if (data.ok && data.url) {
        document.getElementById('cfg-cv').value = data.url;
        const testLink = document.getElementById('cfg-cv-test-link');
        if (testLink) testLink.href = data.url;
        SoundFX.playSuccess();
        alert('✓ Archivo CV (PDF) subido con éxito al servidor.');
      } else {
        alert(data.error || 'Error al subir archivo CV');
      }
    } catch (err) {
      console.error('Error subiendo CV:', err);
      alert('Error de conexión al subir CV');
    }
  };
  reader.readAsDataURL(file);
}

async function loadConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/config`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (data.ok && data.data) {
      const c = data.data;
      const avatarVal = c.avatarUrl || './images/personaje.webp';
      const cvVal = c.cvUrl || './CV_Damian_Alexander_Aceves_Navarrete.pdf';

      if (document.getElementById('cfg-avatar')) document.getElementById('cfg-avatar').value = avatarVal;
      if (document.getElementById('cfg-avatar-preview')) document.getElementById('cfg-avatar-preview').src = avatarVal;
      if (document.getElementById('cfg-cv')) document.getElementById('cfg-cv').value = cvVal;
      if (document.getElementById('cfg-cv-test-link')) document.getElementById('cfg-cv-test-link').href = cvVal;

      if (document.getElementById('cfg-github')) document.getElementById('cfg-github').value = c.githubUrl || '';
      if (document.getElementById('cfg-linkedin')) document.getElementById('cfg-linkedin').value = c.linkedinUrl || '';
      if (document.getElementById('cfg-email')) document.getElementById('cfg-email').value = c.email || '';
      if (document.getElementById('cfg-whatsapp')) document.getElementById('cfg-whatsapp').value = c.whatsapp || '';
      if (document.getElementById('cfg-bio')) document.getElementById('cfg-bio').value = c.bio || '';
      if (document.getElementById('cfg-pin')) document.getElementById('cfg-pin').value = c.adminPin || '1995';
    }
  } catch (err) {
    console.error('Error cargando configuración:', err);
  }
}

async function handleSaveConfig(e) {
  e.preventDefault();
  const payload = {
    avatarUrl: document.getElementById('cfg-avatar') ? document.getElementById('cfg-avatar').value.trim() : './images/personaje.webp',
    cvUrl: document.getElementById('cfg-cv') ? document.getElementById('cfg-cv').value.trim() : './CV_Damian_Alexander_Aceves_Navarrete.pdf',
    githubUrl: document.getElementById('cfg-github').value.trim(),
    linkedinUrl: document.getElementById('cfg-linkedin').value.trim(),
    email: document.getElementById('cfg-email').value.trim(),
    whatsapp: document.getElementById('cfg-whatsapp').value.trim(),
    bio: document.getElementById('cfg-bio').value.trim(),
    adminPin: document.getElementById('cfg-pin').value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/api/admin/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.ok) {
      SoundFX.playSuccess();
      refreshPublicConfig(data.data);
      alert('¡Configuración de perfil, foto y CV actualizada con éxito!');
    } else {
      alert(data.error || 'Error al guardar');
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
  }
}

// =============================================================================
// TAB 4: GUESTBOOK MODERATION
// =============================================================================
async function loadGuestbook() {
  const container = document.getElementById('admin-guestbook-list');
  if (!container) return;

  container.innerHTML = '<div style="padding: 12px; color: #8dafa4;">Cargando firmas...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/guestbook`);
    const data = await res.json();

    if (!data.ok) {
      container.innerHTML = '<div style="padding: 12px; color: #ff6b6b;">Error al cargar firmas</div>';
      return;
    }

    const list = data.data || [];
    if (list.length === 0) {
      container.innerHTML = '<div style="padding: 12px; color: #8dafa4;">No hay firmas aún.</div>';
      return;
    }

    container.innerHTML = list.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: #102620; border: 1px solid #1e483e; padding: 8px 12px; margin-bottom: 8px; border-radius: 2px;">
        <div>
          <strong style="color: #4ade80;">${escapeHtml(item.name)}</strong>
          <span style="color: #fef08a; font-size: 0.8rem; margin-left: 6px;">[${escapeHtml(item.badge || '')}]</span>
          <p style="color: #f1f5f9; margin: 4px 0 0 0; font-size: 0.88rem;">${escapeHtml(item.message)}</p>
        </div>
        <button class="retro-btn btn-delete-gb" data-gb-id="${item.id}" style="color: #ff6b6b; padding: 2px 8px; font-size: 0.85rem;">
          ✕ Eliminar
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-delete-gb').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.gbId;
        if (!confirm('¿Eliminar esta firma del libro?')) return;
        SoundFX.playClick();
        await fetch(`${API_BASE}/api/admin/guestbook/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        loadGuestbook();
      });
    });

  } catch (err) {
    container.innerHTML = '<div style="padding: 12px; color: #ff6b6b;">Error de conexión.</div>';
  }
}

// Refresh dynamic elements on the public page without full reload
function refreshPublicConfig(cfg) {
  if (!cfg) return;
  const bioEl = document.querySelector('.profile-bio');
  if (bioEl && cfg.bio) bioEl.textContent = cfg.bio;

  // Update Avatar image if customized
  if (cfg.avatarUrl) {
    const aboutImg = document.getElementById('about-character-img');
    if (aboutImg) aboutImg.src = cfg.avatarUrl;
  }

  // Update social links
  document.querySelectorAll('a[href*="github.com"]').forEach(a => {
    if (cfg.githubUrl) a.href = cfg.githubUrl;
  });
  document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => {
    if (cfg.linkedinUrl) a.href = cfg.linkedinUrl;
  });

  window.dispatchEvent(new CustomEvent('portfolio_config_updated', { detail: cfg }));
}

async function refreshPublicProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    const data = await res.json();
    if (data.ok && data.data) {
      window.dispatchEvent(new CustomEvent('portfolio_projects_updated', { detail: data.data }));
    }
  } catch (err) {
    console.error('Error refreshing public projects:', err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
