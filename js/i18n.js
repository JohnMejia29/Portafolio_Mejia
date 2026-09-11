/* ==========================================================================
   INTERNATIONALIZATION (i18n) - DYNAMIC SPANISH / ENGLISH TRANSLATIONS
   ========================================================================== */

const TRANSLATIONS = {
  es: {
    nav_inicio: 'Inicio',
    nav_proyectos: 'Proyectos',
    nav_stack: 'Tecnologías',
    nav_sobre_mi: 'Sobre mí',
    nav_contacto: 'Contacto',
    hero_title: 'John Franklin Mejia Chamaya',
    hero_badge: 'Ingeniero de Sistemas',
    hero_status: '● Disponible para nuevos proyectos',
    hero_bio: 'Ingeniero de Sistemas con sólida experiencia en el desarrollo de soluciones empresariales e institucionales reales (Plataforma Académica Colegio Jesús Divino Maestro, Sistemas POS Móvil, Minimarket, Hotelería, Restaurantes, Gimnasios y Panaderías). Especializado en arquitectura Full-Stack, bases de datos SQL y software robusto de alto rendimiento.',
    btn_ver_proyectos: 'Ver proyectos ▶',
    btn_contactar: 'Contactar',
    btn_cv: 'Descargar CV',
    projects_title: 'Proyectos',
    projects_subtitle: 'Soluciones reales construidas con código limpio y arquitectura escalable.',
    filter_all: 'Todos',
    filter_web: 'Web',
    filter_mobile: 'Móvil',
    filter_empty: 'No hay proyectos en esta categoría todavía.',
    btn_view_project: 'Ver proyecto ▶',
    tech_title: 'Tecnologías',
    tech_languages_title: 'Lenguajes',
    tech_languages_sub: 'La base sólida de toda solución de software',
    tech_frameworks_title: 'Frameworks',
    tech_frameworks_sub: 'Herramientas para construir software moderno y escalable',
    tech_tools_title: 'Herramientas',
    tech_tools_sub: 'Mis aliadas esenciales en el ciclo de vida de desarrollo',
    about_title: 'Sobre mí',
    about_notepad_title: 'Descripción.txt',
    about_p1: 'Soy Ingeniero en Sistemas Computacionales y desarrollador web y móvil, con interés en seguir creciendo como full-stack. Me gusta participar en todo el proceso de construcción de un producto: entender la necesidad, plantear una solución y convertirla en una experiencia clara y funcional para el usuario.',
    about_p2: 'Me considero una persona curiosa, autodidacta y responsable, siempre con disposición para aprender nuevas herramientas y mejorar con cada proyecto.',
    about_ready: 'LISTO',
    timeline_exp_date: 'MAY 2025 — ACTUALIDAD',
    timeline_exp_type: 'EXPERIENCIA_02.LOG',
    timeline_exp_title: 'Prácticas profesionales',
    timeline_exp_place: 'Vianko Mex S.A. de C.V. · Cosaif Logistics',
    timeline_exp_desc: 'Participé en el desarrollo web y móvil de una plataforma ferroviaria, integrando mejoras de interfaz, lógica de negocio, comunicación en tiempo real y trabajo con APIs y PostgreSQL.',
    timeline_edu_date: 'AGO 2021 — ENE 2026',
    timeline_edu_type: 'FORMACION_01.LOG',
    timeline_edu_title: 'Ingeniería en Sistemas Computacionales',
    timeline_edu_place: 'Instituto Tecnológico José Mario Molina Pasquel y Henríquez',
    timeline_edu_desc: 'Finalicé mi formación profesional, consolidando bases en desarrollo de software, bases de datos, análisis de sistemas y resolución de problemas.',
    contact_title: 'Contacto',
    contact_sub: '¿Tienes un proyecto en mente o una propuesta profesional? Conectemos.',
    footer_welcome: 'Bienvenido a mi portafolio',
    footer_thanks: 'Gracias por estar aquí'
  },
  en: {
    nav_inicio: 'Home',
    nav_proyectos: 'Projects',
    nav_stack: 'Tech Stack',
    nav_sobre_mi: 'About Me',
    nav_contacto: 'Contact',
    hero_title: 'John Franklin Mejia Chamaya',
    hero_badge: 'Systems Engineer',
    hero_status: '● Available for new projects',
    hero_bio: 'Systems Engineer with extensive experience developing real-world enterprise and institutional software (Jesús Divino Maestro School Academic Platform, Mobile POS Systems, Minimarket, Hotel Management, Restaurants, Gyms, and Bakeries). Specialized in Full-Stack architecture, SQL databases, and high-performance software.',
    btn_ver_proyectos: 'View projects ▶',
    btn_contactar: 'Contact',
    btn_cv: 'Download CV',
    projects_title: 'Projects',
    projects_subtitle: 'Real-world solutions built with clean code and scalable architecture.',
    filter_all: 'All',
    filter_web: 'Web',
    filter_mobile: 'Mobile',
    filter_empty: 'No projects in this category yet.',
    btn_view_project: 'View project ▶',
    tech_title: 'Technologies',
    tech_languages_title: 'Languages',
    tech_languages_sub: 'The solid foundation of all software solutions',
    tech_frameworks_title: 'Frameworks',
    tech_frameworks_sub: 'Tools for creating modern and adaptable software',
    tech_tools_title: 'Tools',
    tech_tools_sub: 'My daily allies in the development lifecycle',
    about_title: 'About me',
    about_notepad_title: 'Description.txt',
    about_p1: 'I am a Computer Systems Engineer and web and mobile developer who is interested in continuing to grow as a full-stack developer. I enjoy taking part in the entire product-building process: understanding a need, proposing a solution, and turning it into a clear and functional user experience.',
    about_p2: 'I consider myself curious, self-taught, and responsible, always willing to learn new tools and improve with every project.',
    about_ready: 'READY',
    timeline_exp_date: 'MAY 2025 — PRESENT',
    timeline_exp_type: 'EXPERIENCE_02.LOG',
    timeline_exp_title: 'Professional internship',
    timeline_exp_place: 'Vianko Mex S.A. de C.V. · Cosaif Logistics',
    timeline_exp_desc: 'I contributed to the web and mobile development of a railway platform, implementing interface improvements, business logic, real-time communication, and integrations with APIs and PostgreSQL.',
    timeline_edu_date: 'AUG 2021 — JAN 2026',
    timeline_edu_type: 'EDUCATION_01.LOG',
    timeline_edu_title: 'Computer Systems Engineering',
    timeline_edu_place: 'José Mario Molina Pasquel y Henríquez Institute of Technology',
    timeline_edu_desc: 'I completed my professional education, strengthening my foundations in software development, databases, systems analysis, and problem-solving.',
    contact_title: 'Contact',
    contact_sub: 'Have a project in mind or a professional proposal? Let us connect.',
    footer_welcome: 'Welcome to my portfolio',
    footer_thanks: 'Thanks for being here'
  }
};

export function initI18n() {
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langLabel = document.getElementById('lang-label');
  const langIcon = document.getElementById('lang-icon');
  let currentLang = 'es';

  const languageIcons = {
    es: './images/MEX.webp',
    en: './images/USA.webp'
  };

  Object.values(languageIcons).forEach(src => {
    const image = new Image();
    image.src = src;
  });

  if (langIcon) {
    langIcon.addEventListener('error', () => {
      langIcon.src = languageIcons[currentLang];
    });
  }

  function applyLanguage(lang) {
    const data = TRANSLATIONS[lang];
    if (!data) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (data[key]) {
        el.textContent = data[key];
      }
    });

    if (langLabel && langIcon) {
      if (lang === 'es') {
        langLabel.textContent = 'EN';
        langIcon.alt = 'Cambiar a inglés';
        langIcon.src = languageIcons.en;
        langToggleBtn.title = 'Change language to English';
      } else {
        langLabel.textContent = 'ES';
        langIcon.alt = 'Cambiar a español';
        langIcon.src = languageIcons.es;
        langToggleBtn.title = 'Cambiar idioma a Español';
      }
    }
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      applyLanguage(currentLang);
    });
  }
}
