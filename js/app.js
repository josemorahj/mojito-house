/* =========================================================

   MOJITO HOUSE — JavaScript Base Application
   Estilo: Tropical Premium
   ========================================================= */

/* ─── CONFIG — Configuración centralizada ──────────────── */
// ⚠️ REEMPLAZAR whatsappNumber con el número real antes de producción
// Formato: código de país + número sin espacios ni signos
// Ejemplo: "521234567890"
const CONFIG = {
  whatsappNumber: "REEMPLAZAR_AQUI", // ← CAMBIAR ANTES DE PRODUCCIÓN
  whatsappTemplates: {
    general: "Hola, vi la web de La Ruta del Litro y me gustaría recibir información.",
    catalogo: (producto) =>
      `Hola, vi el ${producto} en la web de La Ruta del Litro y me gustaría recibir información.`,
    promo: (promo) =>
      `Hola, vi la promoción "${promo}" en la web de La Ruta del Litro y me gustaría recibir información.`,
    evento: (tipo) =>
      `Hola, quiero cotizar un evento (${tipo}) para La Ruta del Litro.`
  }
};

/**
 * getWhatsAppLink(template, param)
 * Genera enlace de WhatsApp usando CONFIG centralizado.
 * @param {string} template - Clave del template ('general', 'catalogo', 'promo', 'evento')
 * @param {string} param - Parámetro para templates que lo requieren
 * @returns {string} URL completa de WhatsApp
 */
function getWhatsAppLink(template = "general", param = "") {
  const number = CONFIG.whatsappNumber;
  const templates = CONFIG.whatsappTemplates;

  let message = templates.general;
  if (template === "catalogo" && param) {
    message = templates.catalogo(param);
  } else if (template === "promo" && param) {
    message = templates.promo(param);
  } else if (template === "evento" && param) {
    message = templates.evento(param);
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ─── Supabase Client (global) ─────────────────────────── */
// Si no existe el SDK de Supabase, se define un proxy vacío
// para evitar errores de referencia en el catch.
const supabase = window.supabase || null;

/* ─── Año dinámico en footer ───────────────────────────── */
(function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ─── Módulo: Modo Oscuro (ThemeManager) ───────────────── */
const ThemeManager = (() => {
  const STORAGE_KEY = 'mojito-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  let $toggleBtn = null;

  const getSystemPreference = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT;

  const getActiveTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return getSystemPreference();
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  };

  const toggle = () => {
    const current =
      document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
  };

  const updateToggleIcon = (theme) => {
    if (!$toggleBtn) return;
    const $use = $toggleBtn.querySelector('use');
    if ($use) {
      $use.setAttribute(
        'href',
        theme === THEME_DARK ? '#icon-sun' : '#icon-moon'
      );
    }
  };

  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  };

  const init = (toggleSelector = '#theme-toggle') => {
    $toggleBtn = document.querySelector(toggleSelector);
    if ($toggleBtn) {
      $toggleBtn.addEventListener('click', toggle);
    }
    const currentTheme = getActiveTheme();
    applyTheme(currentTheme);
    watchSystemTheme();
  };

  return { init, toggle };
})();

/* ─── DOM Content Loaded ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/* ─── Initializer ───────────────────────────────────────── */
function initApp() {
  ThemeManager.init('#theme-toggle');
  initSmoothScroll();
  initActiveNavigation();
  initScrollReveal();
  initFilters();
    initWhatsAppDelegated();
  initWhatsAppFloat();
    fetchProductos();
}

/* ─── Filter State ──────────────────────────────────────── */
let currentFilter = "all";
let catalogoProductos = [];  // <- Array activo (Supabase o fallback)

/* ─── Smooth Scroll ─────────────────────────────────────── */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('header a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
/* ─── Navbar Active Link ────────────────────────────────── */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.6
  });

  sections.forEach(section => {
    observer.observe(section);
  });
}
/* ═══════════════════════════════════════════════════════════
   VISIBILITY CONTROLLER (PRO)
   "La visibilidad no depende del tiempo, depende del estado del DOM"
   ═══════════════════════════════════════════════════════════ */

/* ─── Estado único ──────────────────────────────────────── */
const visibilityState = {
  initialized: false,
  observed: new Set()
};

/* ─── Observer global ───────────────────────────────────── */
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollRevealObserver.unobserve(entry.target);
      visibilityState.observed.add(entry.target);
    }
  });
}, {
  threshold: 0.15
});

/* ─── safeReveal() — Reemplaza COMPLETAMENTE el setTimeout ─ */
function safeReveal() {
  const elements = document.querySelectorAll(
    '.card, .section-title'
  );

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();

    const isInViewport =
      rect.top < window.innerHeight &&
      rect.bottom > 0;

    if (isInViewport) {
      el.classList.add('visible');
      scrollRevealObserver.unobserve(el);
      visibilityState.observed.add(el);
    }
  });
}

/* ─── initScrollReveal() Limpio ─────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.card, .section-title'
  );

  elements.forEach(el => {
    if (!el.classList.contains('visible')) {
      scrollRevealObserver.observe(el);
    }
  });

  //  SOLO UNA VEZ, SIN TIMERS
  requestAnimationFrame(() => {
    safeReveal();
  });

  visibilityState.initialized = true;
}

/* ─── refreshScrollReveal() Correcto ────────────────────── */
function refreshScrollReveal() {
  const newElements = document.querySelectorAll(
    '.card, .section-title'
  );

  newElements.forEach(el => {
    if (
      !el.classList.contains('visible') &&
      !visibilityState.observed.has(el)
    ) {
      scrollRevealObserver.observe(el);
    }
  });

  safeReveal();
}

/* ─── Gallery State ─────────────────────────────────────── */
let galeriaData = [];

/**
 * loadGaleria()
 * Carga la galería Bento. Si hay datos personalizados los usa,
 * si no, BentoGallery usa automáticamente su MOCKUP_BANK interno.
 *
 * Para usar datos propios, pasar un array como segundo parámetro:
 *   BentoGallery.init('#galeria-grid', misImagenes);
 *
 * El MOCKUP_BANK también está disponible como:
 *   BentoGallery.MOCKUP_BANK
 */
function loadGaleria() {
  // Inicializar BentoGallery con fallback automático a MOCKUP_BANK
  BentoGallery.init('#galeria-grid');

  // Actualizar galeriaData desde las celdas del DOM
  // (para el lightbox, que necesita los datos originales)
  galeriaData = [];
  document.querySelectorAll('#galeria-grid .bento-cell[data-bento-id]').forEach((cell) => {
    const id = Number(cell.dataset.bentoId);
    const img = cell.querySelector('.bento-cell__img');
    const titleEl = cell.querySelector('.bento-cell__overlay-title');
    const metaEl = cell.querySelector('.bento-cell__overlay-meta');
    if (id && img) {
      galeriaData.push({
        id: id,
        url: img.src,
        alt: img.alt,
        titulo: titleEl ? titleEl.textContent : '',
        categoria: metaEl ? metaEl.textContent.trim() : ''
      });
    }
  });
}

/**
 * initLightbox()
 * Inicializa el visor de imágenes usando <dialog> nativo.
 * Usa delegación de eventos: un solo listener en el document
 * captura clics en .galeria-item. Sin memory leaks.
 */
function initLightbox() {
  const dialog = document.getElementById("lightbox");
  const btnCerrar = document.getElementById("lightbox-cerrar");
  const img = document.getElementById("lightbox-img");
  const titulo = document.getElementById("lightbox-titulo");
  const categoria = document.getElementById("lightbox-categoria");

  if (!dialog || !btnCerrar) return;

    // Delegación: clic en cualquier bento-cell (imagen)
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".bento-cell:not(.bento-cell--breather)");
    if (!item) return;

        const id = Number(item.dataset.bentoId);
    const data = galeriaData.find(g => g.id === id);
    if (!data) return;

    img.src = data.url;
    img.alt = data.alt;
    titulo.textContent = data.titulo;
    categoria.textContent = data.categoria;

    dialog.showModal();
  });

  // Cerrar con botón X
  btnCerrar.addEventListener("click", () => dialog.close());

  // Cerrar con clic fuera del contenido (backdrop)
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Liberar src al cerrar (buena práctica de memoria)
  dialog.addEventListener("close", () => {
    // No liberamos inmediatamente para permitir animación de salida
    setTimeout(() => { img.src = ""; }, 300);
  });
}

/* ─── Promociones Data Model ────────────────────────────── */
const promocionesSeed = [
  {
    id: 1,
    titulo: "Promoción 2x1",
    descripcion: "Todos los miércoles, dos mojitos al precio de uno. Válido en toda la carta.",
    texto_promo: "2x1"
  },
  {
    id: 2,
    titulo: "Happy Hour",
    descripcion: "De 6 a 8 pm, descuentos especiales en toda la carta. No te lo pierdas.",
    texto_promo: "6-8 PM"
  },
  {
    id: 3,
    titulo: "Noche de Estrenos",
    descripcion: "Cada primer viernes del mes, probamos un nuevo sabor. Esta noche: Mojito de Maracuyá.",
    texto_promo: "NUEVO"
  }
];

/**
 * fetchPromociones()
 * Consulta la tabla 'promociones_destacados' en Supabase.
 * Filtra por activas, vigentes y ordenadas por orden ASC.
 * En caso de error, cae al array seed local (fallback).
 */
async function fetchPromociones() {
  const grid = document.getElementById("destacados-grid");
  if (!grid) return;

  // Mostrar indicador de carga
  grid.innerHTML = '<p class="loading-msg">Cargando promociones...</p>';

  let promociones = [];

  try {
    if (!supabase) throw new Error("Supabase client no disponible");

    const ahora = new Date().toISOString();

    const { data, error } = await supabase
      .from("promociones_destacados")
      .select("id, titulo, descripcion, texto_promo, url_imagen")
      .eq("activa", true)
      .lte("fecha_inicio", ahora)
      .gte("fecha_fin", ahora)
      .order("orden", { ascending: true });

    if (error) throw error;

    promociones = data || [];

  } catch (err) {
    console.warn("Error al cargar promociones desde Supabase, usando fallback local:", err.message);
    promociones = promocionesSeed;
  }

  renderPromociones(promociones);
}

/**
 * renderPromociones(data)
 * Renderiza las tarjetas de promociones en #destacados-grid.
 * Si existe texto_promo, lo muestra como badge destacado.
 */
function renderPromociones(data) {
  const grid = document.getElementById("destacados-grid");
  if (!grid) return;

  if (!data || data.length === 0) {
    grid.innerHTML = '<p class="empty-msg">No hay promociones disponibles en este momento.</p>';
    return;
  }

    grid.innerHTML = data.map(item => `
    <article class="card card--promo">
      ${item.texto_promo ? `<span class="promo-badge">${item.texto_promo}</span>` : ""}
      <h3>${item.titulo}</h3>
      <p>${item.descripcion}</p>
      <button
        class="btn btn-whatsapp card__btn"
        data-whatsapp-template="promo"
        data-whatsapp-param="${item.titulo}"
      >
        Consultar
      </button>
    </article>
  `).join("");

  refreshScrollReveal();
}

/* ─── Productos Data Model (fallback local) ─────────────── */
const productosFallback = [
  {
    id: 1,
    name: "Mojito Clásico",
    description: "El tradicional con hierbabuena, lima y ron blanco.",
    category: "clasico",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80",
    jerarquia: "FavoritoSemana"
  },
  {
    id: 2,
    name: "Mojito de Fresa",
    description: "Fresas frescas maceradas con hierbabuena y un toque de limón.",
    category: "frutal",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80"
  },
  {
    id: 3,
    name: "Mojito de Piña",
    description: "Toque tropical con piña natural, coco y ron dorado.",
    category: "tropical",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80"
  },
  {
    id: 4,
    name: "Mojito de Mango",
    description: "Mango maduro, chile y un toque de cilantro fresco.",
    category: "frutal",
    image: "https://images.unsplash.com/photo-1551751299-1b51cab2694c?w=400&q=80"
  },
  {
    id: 5,
    name: "Mojito del Mes — Maracuyá",
    description: "Edición limitada: maracuyá fresco, jengibre y un toque de chili. ⚡ Solo por tiempo limitado.",
    category: "tropical",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80",
    isFeatured: true,
    featuredLayout: "vertical"
  }
];

/**
 * fetchProductos()
 * Consulta la tabla 'productos_catalogo' en Supabase.
 * En caso de éxito, guarda los datos en catalogoProductos y renderiza.
 * En caso de error, cae al array fallback local.
 */
async function fetchProductos() {
  const grid = document.getElementById("catalogo-grid");
  if (!grid) return;

  // Mostrar indicador de carga
  grid.innerHTML = '<p class="loading-msg">Cargando catálogo...</p>';

  let productos = [];

  try {
    if (!supabase) throw new Error("Supabase client no disponible");

    const { data, error } = await supabase
      .from("productos_catalogo")
      .select("id, name, description, category")
      .order("id", { ascending: true });

    if (error) throw error;

    productos = data || [];

  } catch (err) {
    console.warn("Error al cargar productos desde Supabase, usando fallback local:", err.message);
    productos = productosFallback;
  }

  catalogoProductos = productos;
  renderProducts(catalogoProductos, currentFilter);
}

/* ─── Render Functions ───────────────────────────────────── */
function renderProducts(productsArray, filter = "all") {
  const grid = document.getElementById("catalogo-grid");
  if (!grid) return;

  const filteredProducts = filter === "all"
    ? productsArray
    : productsArray.filter(p => p.category === filter);

  // Marcar el botón activo del filtro actual
  document.querySelectorAll(".filters button").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });

  // Pipeline: inyectar respiros visuales cada 3 productos
  const mixedArray = CatalogPipeline.inject(filteredProducts, { interval: 3 });

  // Renderizar el array mixto
  const html = mixedArray.map(item => {
    if (item.type === 'breather') {
      return BreatherCard.render(item);
    }
    return ProductCard.render(item);
  }).join("");

  grid.innerHTML = html;
  refreshScrollReveal();
}

/* ─── WhatsApp Click Handler (delegado) ──────────────── */
// Captura todos los elementos con data-whatsapp-template
// Hero CTA (<a>), cards de catálogo (<button>), promos, eventos, contacto
function initWhatsAppDelegated() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-whatsapp-template]");
    if (!btn) return;

    e.preventDefault();
    const template = btn.dataset.whatsappTemplate;
    const param = btn.dataset.whatsappParam || "";
    window.open(getWhatsAppLink(template, param), "_blank");
  });
}

/* ─── WhatsApp Floating Button ────────────────────────── */
function initWhatsAppFloat() {
  const floatBtn = document.getElementById("whatsapp-float");
  if (!floatBtn) return;

  floatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(getWhatsAppLink("general"), "_blank");
  });
}

/* ─── Filter Events ─────────────────────────────────────── */
function initFilters() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    const filter = btn.dataset.filter;
    currentFilter = filter;

    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (catalogoProductos.length > 0) {
      renderProducts(catalogoProductos, filter);
    }
  });
}


