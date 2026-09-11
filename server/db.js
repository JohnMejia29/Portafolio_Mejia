import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial seed data
const initialProjects = [
  {
    id: 'colegio',
    title: 'Colegio Jesús Divino Maestro - Plataforma Académica & Aula Virtual',
    exeName: 'COLEGIO_JESUS_DIVINO_MAESTRO.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 1
  },
  {
    id: 'pos_movil',
    title: 'Sistema POS Móvil - Punto de Venta & Facturación',
    exeName: 'SISTEMA_POS_MOVIL.EXE',
    status: 'ONLINE',
    category: 'movil',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 2
  },
  {
    id: 'minimarket',
    title: 'Sistema Comercial & Control de Inventarios Minimarket',
    exeName: 'SISTEMA_MINIMARKET.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 3
  },
  {
    id: 'restaurante',
    title: 'Sistema para Restaurante - Comandera Digital & KDS',
    exeName: 'SISTEMA_RESTAURANTE.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 4
  },
  {
    id: 'hotel',
    title: 'Sistema de Gestión Hotelera & Reservas (PMS)',
    exeName: 'SISTEMA_HOTEL.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 5
  },
  {
    id: 'gym',
    title: 'Sistema de Gestión de Gimnasios & Membresías',
    exeName: 'SISTEMA_GYM.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 6
  },
  {
    id: 'panaderia',
    title: 'Sistema para Panaderías & Costeo de Producción',
    exeName: 'SISTEMA_PANADERIA.EXE',
    status: 'ONLINE',
    category: 'web',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 7
  },
  {
    id: 'gasto',
    title: 'Gasto - App Móvil de Finanzas Personales Offline-First',
    exeName: 'GASTO.EXE',
    status: 'ONLINE',
    category: 'movil',
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
    demoUrl: 'https://www.colegiojesusdivinomaestro.com/',
    order: 8
  }
];

const initialConfig = {
  profileName: 'John Franklin Mejia Chamaya',
  titleBadge: 'Ingeniero de Sistemas',
  statusText: 'Disponible para nuevos proyectos',
  bio: 'Ingeniero de Sistemas con sólida experiencia en el desarrollo de soluciones empresariales e institucionales reales (Plataforma Académica Colegio Jesús Divino Maestro, Sistemas POS Móvil, Minimarket, Hotelería, Restaurantes, Gimnasios y Panaderías). Especializado en arquitectura Full-Stack, bases de datos SQL y software robusto de alto rendimiento.',
  githubUrl: 'https://github.com/JohnFranklinMejia',
  linkedinUrl: 'https://www.linkedin.com/in/john-franklin-mejia-chamaya/',
  email: 'johnmejia@example.com',
  whatsapp: '+51 900 000 000',
  cvUrl: './CV_Damian_Alexander_Aceves_Navarrete.pdf',
  adminPin: '1995'
};

const initialData = {
  stats: {
    totalVisits: 1440,
    commandsExecuted: 0,
    messagesReceived: 0,
    guestbookEntries: 0,
    startTime: new Date().toISOString()
  },
  config: initialConfig,
  projects: initialProjects,
  messages: [],
  guestbook: [
    {
      id: 'gb_seed_1',
      name: 'Ada Lovelace',
      avatar: 'code',
      badge: 'Pionera',
      message: 'Excelente diseño y arquitectura. La terminal interactiva y el backend quedaron impecables.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      likes: 5
    },
    {
      id: 'gb_seed_2',
      name: 'Linus T.',
      avatar: 'terminal',
      badge: 'Open Source',
      message: 'Gran integración de rendimiento full-stack con respuestas limpias y modulares.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 12
    }
  ]
};

// Load or initialize DB
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveDB(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      stats: { ...initialData.stats, ...(parsed.stats || {}) },
      config: { ...initialConfig, ...(parsed.config || {}) },
      projects: parsed.projects && parsed.projects.length ? parsed.projects : initialProjects,
      messages: parsed.messages || [],
      guestbook: parsed.guestbook || initialData.guestbook
    };
  } catch (err) {
    console.error('Error reading database file:', err);
    return initialData;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

class Database {
  constructor() {
    this.data = loadDB();
  }

  // --- STATS ---
  incrementVisits() {
    this.data.stats.totalVisits += 1;
    saveDB(this.data);
    return this.data.stats.totalVisits;
  }

  incrementCommands() {
    this.data.stats.commandsExecuted += 1;
    saveDB(this.data);
    return this.data.stats.commandsExecuted;
  }

  getStats() {
    return {
      ...this.data.stats,
      totalMessages: this.data.messages.length,
      unreadMessages: this.data.messages.filter(m => m.status === 'unread').length,
      totalProjects: this.data.projects.length,
      totalGuestbook: this.data.guestbook.length,
      uptimeSeconds: Math.floor(process.uptime())
    };
  }

  // --- CONFIG / SOCIAL LINKS ---
  getConfig() {
    return { ...this.data.config };
  }

  updateConfig(newConfig) {
    this.data.config = {
      ...this.data.config,
      ...newConfig
    };
    saveDB(this.data);
    return this.data.config;
  }

  // --- MESSAGES (CONTACT) ---
  getMessages() {
    return this.data.messages.slice().reverse();
  }

  addMessage({ name, email, subject, message, ip }) {
    const newMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name ? name.trim() : 'Anónimo',
      email: email ? email.trim() : '',
      subject: subject ? subject.trim() : 'Propuesta / Mensaje desde PORTFOLIO.EXE',
      message: message ? message.trim() : '',
      ip: ip || '127.0.0.1',
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    this.data.messages.push(newMessage);
    this.data.stats.messagesReceived = this.data.messages.length;
    saveDB(this.data);
    return newMessage;
  }

  markMessageRead(id) {
    const msg = this.data.messages.find(m => m.id === id);
    if (msg) {
      msg.status = 'read';
      saveDB(this.data);
      return msg;
    }
    return null;
  }

  deleteMessage(id) {
    const index = this.data.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      const removed = this.data.messages.splice(index, 1)[0];
      this.data.stats.messagesReceived = this.data.messages.length;
      saveDB(this.data);
      return removed;
    }
    return null;
  }

  // --- PROJECTS (CMS) ---
  getProjects() {
    return this.data.projects.slice().sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getProjectById(id) {
    return this.data.projects.find(p => p.id === id) || null;
  }

  createProject(projectData) {
    const id = projectData.id ? projectData.id.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'proj_' + Date.now();
    const newProject = {
      id,
      title: projectData.title || 'Nuevo Proyecto',
      exeName: projectData.exeName || (id.toUpperCase() + '.EXE'),
      status: projectData.status || 'ONLINE',
      category: projectData.category || 'web',
      summary: projectData.summary || '',
      cover: projectData.cover || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
      architecture: projectData.architecture || '',
      features: Array.isArray(projectData.features) ? projectData.features : [],
      stack: Array.isArray(projectData.stack) ? projectData.stack : [],
      repoUrl: projectData.repoUrl || 'https://github.com/JohnFranklinMejia',
      demoUrl: projectData.demoUrl || '',
      order: projectData.order || (this.data.projects.length + 1),
      createdAt: new Date().toISOString()
    };

    this.data.projects.push(newProject);
    saveDB(this.data);
    return newProject;
  }

  updateProject(id, projectData) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.projects[index] = {
        ...this.data.projects[index],
        ...projectData,
        id // Keep original ID
      };
      saveDB(this.data);
      return this.data.projects[index];
    }
    return null;
  }

  deleteProject(id) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      const removed = this.data.projects.splice(index, 1)[0];
      saveDB(this.data);
      return removed;
    }
    return null;
  }

  // --- GUESTBOOK ---
  getGuestbook() {
    return this.data.guestbook.slice().reverse();
  }

  addGuestbookEntry({ name, avatar, badge, message }) {
    const allowedAvatars = ['terminal', 'code', 'server', 'database', 'cpu'];
    const selectedAvatar = allowedAvatars.includes(avatar) ? avatar : 'terminal';

    const entry = {
      id: 'gb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: (name && name.trim()) ? name.trim().slice(0, 30) : 'Visitante',
      avatar: selectedAvatar,
      badge: badge ? badge.trim().slice(0, 20) : 'Dev Guest',
      message: (message && message.trim()) ? message.trim().slice(0, 280) : 'Saludos!',
      createdAt: new Date().toISOString(),
      likes: 0
    };

    this.data.guestbook.push(entry);
    this.data.stats.guestbookEntries = this.data.guestbook.length;
    saveDB(this.data);
    return entry;
  }

  likeGuestbookEntry(id) {
    const entry = this.data.guestbook.find(e => e.id === id);
    if (entry) {
      entry.likes = (entry.likes || 0) + 1;
      saveDB(this.data);
      return entry;
    }
    return null;
  }

  deleteGuestbookEntry(id) {
    const index = this.data.guestbook.findIndex(e => e.id === id);
    if (index !== -1) {
      const removed = this.data.guestbook.splice(index, 1)[0];
      this.data.stats.guestbookEntries = this.data.guestbook.length;
      saveDB(this.data);
      return removed;
    }
    return null;
  }
}

export const db = new Database();
