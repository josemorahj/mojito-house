/* =========================================================

   MOJITO HOUSE — JavaScript Base Application
   Estilo: Tropical Premium
   ========================================================= */

/* ─── DOM Content Loaded ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/* ─── Initializer ───────────────────────────────────────── */
function initApp() {
  initSmoothScroll();
  initActiveNavigation();
  initScrollReveal();
  initFilters();
  renderProducts();
  loadGaleria();
  initLightbox();
}

/* ─── Filter State ──────────────────────────────────────── */
let currentFilter = "all";

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
/* ─── Intersection Observer ─────────────────────────────── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.card, .section-title, #inicio, .galeria-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}
/* ─── Refresh Scroll Reveal ─────────────────────────────── */
function refreshScrollReveal() {
  initScrollReveal();
}

/* ─── Gallery Data Model ─────────────────────────────────── */
const galeriaImagenes = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
    alt: "Mojito Clásico servido en vaso alto con hierbabuena y lima",
    titulo: "Mojito Clásico",
    categoria: "Coctelería"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
    alt: "Coctel de frutos rojos decorado con fresas",
    titulo: "Mojito de Frutos Rojos",
    categoria: "Coctelería"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    alt: "Barra iluminada con cocteles tropicales al atardecer",
    titulo: "Nuestra Barra",
    categoria: "Ambiente"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80",
    alt: "Grupo de personas brindando con mojitos en la terraza",
    titulo: "Momentos Inolvidables",
    categoria: "Experiencia"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80",
    alt: "Mojito tropical decorado con rodaja de piña y flores",
    titulo: "Mojito Tropical",
    categoria: "Coctelería"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1571167530141-f5b98fa05d1b?w=600&q=80",
    alt: "Interior del local con iluminación cálida y plantas",
    titulo: "El Local",
    categoria: "Ambiente"
  }
];

/* ─── Gallery State ─────────────────────────────────────── */
let galeriaData = [];

/**
 * loadGaleria()
 * Carga los datos de la galería y renderiza el grid.
 * Fase 1: usa array local (galeriaImagenes).
 * Fase 2 (futuro): reemplazar por fetch a Supabase.
 */
function loadGaleria() {
  galeriaData = galeriaImagenes;
  renderGaleria();
}

/**
 * renderGaleria()
 * Renderiza el grid de imágenes en #galeria-grid.
 * Cada item es un <figure> con img, overlay figcaption y data-id.
 */
function renderGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  if (galeriaData.length === 0) {
    grid.innerHTML = '<p class="empty-msg">Galería próximamente.</p>';
    return;
  }

  grid.innerHTML = galeriaData.map(item => `
    <figure class="galeria-item" data-id="${item.id}" role="button" tabindex="0"
            aria-label="Ver imagen: ${item.titulo}">
      <img
        src="${item.url}"
        alt="${item.alt}"
        loading="lazy"
        width="600"
        height="450"
      >
      <figcaption>
        <h3>${item.titulo}</h3>
        <span>${item.categoria}</span>
      </figcaption>
    </figure>
  `).join("");

  // Refrescar scroll reveal para los nuevos elementos del DOM
  refreshScrollReveal();
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

  // Delegación: clic en cualquier galeria-item
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".galeria-item");
    if (!item) return;

    const id = Number(item.dataset.id);
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

/* ─── Render Functions ───────────────────────────────────── */
function renderProducts(filter = "all") {
  const catalogoSection = document.querySelector("#catalogo");

  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  const html = filteredProducts.map(product => `
    <div class="card">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
    </div>
  `).join("");

  catalogoSection.innerHTML = `
    <div class="container">
      <h2 class="section-title">Catálogo</h2>

      <div class="filters">
        <button data-filter="all">Todos</button>
        <button data-filter="clasico">Clásico</button>
        <button data-filter="frutal">Frutal</button>
        <button data-filter="tropical">Tropical</button>
      </div>

      <div class="card-grid">
        ${html}
      </div>
    </div>
  `;

  refreshScrollReveal();
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

    renderProducts(filter);
  });
}

