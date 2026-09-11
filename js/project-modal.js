/* ==========================================================================
   PROJECT VIEWER MODAL - NOMBRE_PROYECTO.EXE
   Displays State: ONLINE, Stack, Key Features, Architecture, [DEMO] [GITHUB] [CERRAR]
   ========================================================================== */

import { SoundFX } from './sound-fx.js';
import { WindowManager } from './window-manager.js';
import { getApiBase } from './backend-client.js';

const API_BASE = getApiBase();

export const PROJECTS_DATA = {
  colegio: {
    title: 'Colegio Jesús Divino Maestro - Plataforma Académica & Aula Virtual',
    exeName: 'COLEGIO_JESUS_DIVINO_MAESTRO.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Plataforma institucional integral y aula virtual para la I.E. Nº 16957 "Jesús Divino Maestro", con gestión de calificaciones, asistencias, tareas, comunicados y roles multi-usuario.',
    cover: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura web modular cliente-servidor con autenticación robusta, control de acceso basado en roles (RBAC: Administrador, Docentes, Estudiantes, Padres de Familia), base de datos relacional MySQL/PostgreSQL y generación dinámica de boletas de notas y reportes académicos.',
    features: [
      'Módulo integral de calificaciones y libreta de notas por periodos académicos.',
      'Control diario de asistencia escolar con reportes y porcentajes automáticos.',
      'Aula virtual interactiva para asignación, entrega y retroalimentación de tareas.',
      'Tablero de comunicados institucionales, avisos a padres y mensajería escolar.',
      'Panel administrativo central con control de matrículas, docentes y auditoría.'
    ],
    stack: [
      { name: 'PHP / Laravel', icon: './stack_icons/node.svg' },
      { name: 'JavaScript', icon: './stack_icons/javascript.svg' },
      { name: 'MySQL / Postgres', icon: './stack_icons/sql.svg' },
      { name: 'HTML5 / CSS3', icon: './stack_icons/html.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/css.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  pos_movil: {
    title: 'Sistema POS Móvil - Punto de Venta & Facturación',
    exeName: 'SISTEMA_POS_MOVIL.EXE',
    status: 'ONLINE',
    category: 'Móvil',
    summary: 'Aplicación móvil para punto de venta ágil, emisión de comprobantes, control de stock en tiempo real y sincronización offline/online.',
    cover: './projects/gasto/cover.webp',
    architecture: 'Arquitectura móvil Offline-First con base de datos local SQLite/WatermelonDB, sincronización bidireccional en segundo plano contra API RESTful en Node.js y conexión Bluetooth para impresión de tickets térmicos.',
    features: [
      'Venta rápida al paso con escaneo de código de barras mediante cámara móvil.',
      'Impresión inalámbrica de tickets de venta por Bluetooth / Wi-Fi térmico.',
      'Sincronización automática de inventario y transacciones al recuperar conexión.',
      'Arqueo de caja, turnos de vendedores y reportes de facturación diaria.'
    ],
    stack: [
      { name: 'React Native', icon: './stack_icons/react.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'SQLite', icon: './stack_icons/sql.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  minimarket: {
    title: 'Sistema Comercial & Control de Inventarios Minimarket',
    exeName: 'SISTEMA_MINIMARKET.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Software comercial integral de punto de venta, compras a proveedores, control de stock por lotes y código de barras, caja diaria y análisis de ventas.',
    cover: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura SPA cliente-servidor con Next.js/React, backend RESTful en Node.js/Express, base de datos relacional PostgreSQL con transacciones ACID para cobros seguros y auditoría continua de kardex.',
    features: [
      'Punto de venta ultra-rápido optimizado para teclado y lector óptico de código de barras.',
      'Control de inventario con alertas automáticas de stock mínimo y vencimiento de productos.',
      'Gestión de cuentas por cobrar a clientes (fiados) y pagos a distribuidores.',
      'Reportes analíticos de rentabilidad, margen de ganancia y productos más vendidos.'
    ],
    stack: [
      { name: 'Next.js', icon: './stack_icons/nextjs.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/tailwind.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  hotel: {
    title: 'Sistema de Gestión Hotelera & Reservas (PMS)',
    exeName: 'SISTEMA_HOTEL.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Plataforma para administración hotelera con calendario interactivo de reservas, control de ocupación de habitaciones, estados de limpieza, consumos extras y check-in/out.',
    cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura reactiva con panel interactivo en tiempo real con WebSockets para visualización instantánea del estado de habitaciones, backend RESTful modular y liquidación automática de consumos.',
    features: [
      'Mapa gráfico de pisos y habitaciones con estados en tiempo real (Disponible, Ocupada, Limpieza, Mantenimiento).',
      'Flujo rápido de Check-in con registro de huéspedes y Check-out con liquidación automática.',
      'Cargos a la habitación de consumos en restaurante, frigobar y servicios adicionales.',
      'Historial de huéspedes, tarifas dinámicas por temporada y tasa de ocupación.'
    ],
    stack: [
      { name: 'React', icon: './stack_icons/react.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/tailwind.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  restaurante: {
    title: 'Sistema para Restaurante - Comandera Digital & KDS',
    exeName: 'SISTEMA_RESTAURANTE.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Solución gastronómica completa con comandas digitales para meseros, pantalla de cocina en tiempo real (KDS), mapa de mesas, recetas y facturación dividida.',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura distribuida con WebSockets en tiempo real sincronizando dispositivos de salón (mozos), pantallas de cocina/barra (KDS) y caja central con persistencia relacional.',
    features: [
      'Plano visual de salón y terrazas con tiempos de ocupación y estado de atención.',
      'Comandera táctil con modificadores de platos (términos, sin cebolla, salsas extras).',
      'Pantalla KDS de cocina con alertas sonoras y orden cronológico de pedidos.',
      'División de cuentas entre comensales, múltiples métodos de pago y propinas.'
    ],
    stack: [
      { name: 'Next.js', icon: './stack_icons/nextjs.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/tailwind.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  gym: {
    title: 'Sistema de Gestión de Gimnasios & Membresías',
    exeName: 'SISTEMA_GYM.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Plataforma para control de socios, cobro de membresías y suscripciones periódicas, control de acceso peatonal, planes de entrenamiento y caja diaria.',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura web escalable con gestión de membresías temporales, integración con lectores de código de barras/biometría y alertas automáticas de vencimiento.',
    features: [
      'Control de acceso con validación visual inmediata de membresía (Activa / Vencida / Congelada).',
      'Gestión de planes personalizados (mensual, trimestral, anual, pase libre, disciplinas).',
      'Módulo de venta de suplementos, bebidas e indumentaria deportiva en recepción.',
      'Dashboard con métricas de afluencia por horarios pico, renovaciones y retención.'
    ],
    stack: [
      { name: 'React', icon: './stack_icons/react.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'Express', icon: './stack_icons/express.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  panaderia: {
    title: 'Sistema para Panaderías & Costeo de Producción',
    exeName: 'SISTEMA_PANADERIA.EXE',
    status: 'ONLINE',
    category: 'Web',
    summary: 'Software especializado para panaderías y pastelerías con costeo de recetas e insumos, control de turnos de producción diaria, punto de venta y control de mermas.',
    cover: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    architecture: 'Arquitectura transaccional de inventario con conversión automática de unidades (kg, gramos, unidades), cálculo de costo estándar por fórmula y punto de venta de alta rotación.',
    features: [
      'Fórmulas y recetas con deducción automática de insumos (harina, levadura, mantequilla, etc.).',
      'Programación de lotes de producción por turnos (mañana, tarde, noche) y horneadas.',
      'Venta rápida al mostrador con combos, pesaje y promociones del día.',
      'Control de mermas y balance de rendimiento por quintal de harina.'
    ],
    stack: [
      { name: 'React', icon: './stack_icons/react.svg' },
      { name: 'Node.js', icon: './stack_icons/node.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/tailwind.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  },
  gasto: {
    title: 'Gasto - App Móvil de Finanzas Personales Offline-First',
    exeName: 'GASTO.EXE',
    status: 'ONLINE',
    category: 'Móvil',
    summary: 'Aplicación multiplataforma de finanzas personales con funcionamiento offline y sincronización automática.',
    cover: './projects/gasto/cover.webp',
    architecture: 'Arquitectura Offline-First con base de datos local SQLite, sincronización determinista en segundo plano contra Supabase / PostgreSQL y gestión de estado reactivo.',
    features: [
      'Registro rápido de ingresos y gastos con categorización inteligente personalizada.',
      'Persistencia y funcionamiento offline completo con sincronización al reconectar.',
      'Dashboard interactivo con balance en tiempo real y gráficas de consumo mensual.',
      'Sincronización segura en la nube con Supabase Auth y Row Level Security.'
    ],
    stack: [
      { name: 'React Native', icon: './stack_icons/react.svg' },
      { name: 'TypeScript', icon: './stack_icons/typescript.svg' },
      { name: 'Supabase', icon: './stack_icons/supabase.svg' },
      { name: 'PostgreSQL', icon: './stack_icons/postgresql.svg' },
      { name: 'Tailwind CSS', icon: './stack_icons/tailwind.svg' }
    ],
    repoUrl: 'https://github.com/JohnFranklinMejia',
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/'
  }
};

export function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const windowTitleEl = document.getElementById('modal-window-title');
  const titleEl = document.getElementById('modal-project-title');
  const statusBadge = document.getElementById('modal-status-badge');
  const coverImg = document.getElementById('modal-main-image');
  const descEl = document.getElementById('modal-project-desc');
  const archEl = document.getElementById('modal-project-arch');
  const featuresList = document.getElementById('modal-features-list');
  const stackContainer = document.getElementById('modal-stack-container');
  const repoLink = document.getElementById('modal-repo-link');
  const demoLink = document.getElementById('modal-demo-link');
  const closeBtns = modal.querySelectorAll('.btn-close, #modal-close-btn, #modal-close-footer');

  function openProject(projectId) {
    const project = PROJECTS_DATA[projectId];
    if (!project) return;

    if (windowTitleEl) windowTitleEl.textContent = project.exeName;
    if (titleEl) titleEl.textContent = project.title;
    if (statusBadge) statusBadge.textContent = project.status || 'ONLINE';
    if (coverImg) coverImg.src = project.cover;
    if (descEl) descEl.textContent = project.summary;
    if (archEl) archEl.textContent = project.architecture;

    if (featuresList) {
      featuresList.innerHTML = project.features.map(f => `<li>✓ ${f}</li>`).join('');
    }

    if (stackContainer) {
      stackContainer.innerHTML = project.stack.map(s => `
        <span class="tag-pill" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; background: #e5ded0; border: 1px solid #7a705e; font-family: var(--font-pixel); font-size: 0.95rem; color: #175244;">
          <img src="${s.icon}" width="16" height="16" alt="" style="object-fit: contain;">
          ${s.name}
        </span>
      `).join('');
    }

    if (repoLink) repoLink.href = project.repoUrl;
    if (demoLink) demoLink.href = project.demoUrl;

    modal.classList.add('active');
    modal.style.display = 'flex';
    SoundFX.playClick();
  }

  function closeModal() {
    SoundFX.playClose();
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 150);
  }

  function renderProjectsGrid(projectsArray) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !projectsArray || !projectsArray.length) return;

    grid.innerHTML = projectsArray.map(p => `
      <article class="retro-window project-card" data-category="${p.category || 'web'}">
        <div class="retro-titlebar">
          <div class="titlebar-left">
            <span class="titlebar-icon">
              <img src="./header_icons/proyectos.webp" alt="" width="16" height="16" style="image-rendering: pixelated;">
            </span>
            <span class="titlebar-title">${escapeHtml(p.exeName || p.id)}</span>
          </div>
          <div class="titlebar-controls">
            <button class="window-btn btn-minimize">_</button>
            <button class="window-btn btn-maximize">□</button>
          </div>
        </div>
        <div class="project-preview">
          <img src="${p.cover || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80'}" alt="${escapeHtml(p.title)}" loading="lazy">
          <span class="project-badge" style="${p.demoUrl ? 'background: #1e3a8a; color: #93c5fd;' : ''}">${p.category === 'movil' ? 'Móvil' : 'Web'}${p.demoUrl ? ' · En Producción' : ''}</span>
        </div>
        <div class="project-body">
          <div>
            <h3 class="project-name">${escapeHtml(p.title)}</h3>
            <p class="project-desc">${escapeHtml(p.summary || '')}</p>
            <div class="project-tags">
              ${(p.stack || []).slice(0, 3).map(s => {
                const sName = typeof s === 'string' ? s : s.name;
                const sIcon = (typeof s === 'object' && s.icon) ? s.icon : './stack_icons/node.svg';
                return `<span class="tag-pill"><img src="${sIcon}" width="14" height="14" alt="" style="vertical-align: middle;"> ${escapeHtml(sName)}</span>`;
              }).join('')}
              <span class="tag-pill">${p.category === 'movil' ? 'Offline-First' : 'Full-Stack'}</span>
            </div>
          </div>
          <div class="project-footer">
            <button class="retro-btn btn-primary view-project-trigger" data-project-id="${p.id}" data-i18n="btn_view_project">
              Ver proyecto ▶
            </button>
            ${p.demoUrl ? `
              <a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" class="retro-btn" style="color: #4ade80;">
                🌐 En Vivo
              </a>
            ` : `
              <a href="${p.repoUrl || 'https://github.com/JohnFranklinMejia'}" target="_blank" rel="noopener noreferrer" class="retro-btn">
                <img src="./stack_icons/github.svg" width="14" height="14" alt="" style="vertical-align: middle; margin-right: 4px;">
                Repo
              </a>
            `}
          </div>
        </div>
      </article>
    `).join('');

    // Re-bind trigger buttons on newly rendered cards
    grid.querySelectorAll('.view-project-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = btn.dataset.projectId;
        openProject(pId);
      });
    });
  }

  // Trigger buttons across project cards
  document.querySelectorAll('.view-project-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.dataset.projectId || 'colegio';
      openProject(pId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Listen for real-time project updates from Admin CMS
  window.addEventListener('portfolio_projects_updated', (e) => {
    const list = e.detail;
    if (Array.isArray(list)) {
      list.forEach(p => {
        PROJECTS_DATA[p.id] = p;
      });
      renderProjectsGrid(list);
    }
  });

  // Initial fetch from backend API
  fetch(`${API_BASE}/api/projects`)
    .then(r => r.json())
    .then(data => {
      if (data.ok && Array.isArray(data.data) && data.data.length > 0) {
        data.data.forEach(p => {
          PROJECTS_DATA[p.id] = p;
        });
        renderProjectsGrid(data.data);
      }
    })
    .catch(() => {
      // Local fallback already loaded in PROJECTS_DATA
    });

  // Initial config sync
  fetch(`${API_BASE}/api/config`)
    .then(r => r.json())
    .then(data => {
      if (data.ok && data.data) {
        const cfg = data.data;
        const bioEl = document.querySelector('.profile-bio');
        if (bioEl && cfg.bio) bioEl.textContent = cfg.bio;

        document.querySelectorAll('a[href*="github.com"]').forEach(a => {
          if (cfg.githubUrl) a.href = cfg.githubUrl;
        });
        document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => {
          if (cfg.linkedinUrl) a.href = cfg.linkedinUrl;
        });
      }
    })
    .catch(() => {});
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

