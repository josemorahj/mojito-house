/**
 * @file BentoCell.js
 * @description Componente de celda individual para BentoGallery.
 *
 * Renderiza un <figure> con imagen, overlay (título + categoría + icono),
 * y clases BEM según el tipo de celda ('product', 'social', 'context', 'breather').
 *
 * Dependencias:
 * - Icons.get() : js/icons.js (sistema de iconos SVG)
 * - ScrollReveal.js : js/shared/ScrollReveal.js (animación de entrada)
 *
 * Tipos de celda:
 *   product  → foto de producto (estudio, estática)
 *   social   → foto emocional (gente, eventos, experiencias)
 *   context  → foto de atmósfera (local, branding, ambiente)
 *   breather → celda de respiro narrativo (texto + icono, sin imagen)
 *
 * Uso:
 *   const html = BentoCell.render({
 *     id: 1,
 *     type: 'social',
 *     url: 'https://...',
 *     alt: 'Gente brindando',
 *     title: 'Brindis en la terraza',
 *     category: 'Experiencia',
 *     areaName: 's1',
 *     index: 0
 *   });
 */

const BentoCell = (() => {
  /* ─── Mapa de clases BEM por tipo ────────────────────── */
  const TYPE_CLASSES = {
    product: 'bento-cell--product',
    social: 'bento-cell--social',
    context: 'bento-cell--context',
    breather: 'bento-cell--breather'
  };

  /* ─── Pool de respiros narrativos ─────────────────────── */
  const BREATHER_POOL = [
    {
      id: 'breather-gallery-1',
      icon: 'flame',
      headline: 'Sabor que enciende',
      sub: 'Cada mojito cuenta una historia'
    },
    {
      id: 'breather-gallery-2',
      icon: 'sparkles',
      headline: 'Momentos que brillan',
      sub: 'La fiesta empieza con un sorbo'
    },
    {
      id: 'breather-gallery-3',
      icon: 'champagne',
      headline: 'Brindis sin fronteras',
      sub: 'En tu casa, en tu evento, donde quieras'
    },
    {
      id: 'breather-gallery-4',
      icon: 'handshake',
      headline: 'Hecho para compartir',
      sub: 'El litro de la buena compañia'
    }
  ];

  let breatherIndex = 0;
  function nextBreather() {
    const item = BREATHER_POOL[breatherIndex % BREATHER_POOL.length];
    breatherIndex++;
    return { ...item };
  }

  /* ─── Renderizar celda de imagen ─────────────────────── */
  function renderMediaCell(data) {
    const {
      id,
      type = 'product',
      url,
      alt = '',
      title = '',
      category = '',
      areaName = '',
      index = 0
    } = data;

    const typeClass = TYPE_CLASSES[type] || TYPE_CLASSES.product;

    // Icono SVG en overlay (reemplaza emojis)
    const iconName = type === 'social' ? 'sparkles'
                   : type === 'context' ? 'home'
                   : 'star';
    const iconHTML = Icons.get(iconName, {
      color: 'var(--color-accent-light)',
      size: '14px'
    });

    return `
      <figure
        class="bento-cell ${typeClass} reveal"
        data-bento-id="${id}"
        data-bento-type="${type}"
        data-bento-area="${areaName}"
        data-bento-index="${index}"
        role="button"
        tabindex="0"
        aria-label="Ver imagen: ${title}"
        style="--cell-index: ${index};"
      >
        <img
          class="bento-cell__img"
          src="${url}"
          alt="${alt}"
          loading="lazy"
          width="600"
          height="400"
        >
        <figcaption class="bento-cell__overlay">
          <h3 class="bento-cell__overlay-title">${title}</h3>
          <span class="bento-cell__overlay-meta">
            ${iconHTML}
            ${category}
          </span>
        </figcaption>
      </figure>
    `;
  }

  /* ─── Renderizar celda de respiro (breather) ──────────── */
  function renderBreatherCell(data = {}) {
    const breather = nextBreather();
    const {
      id = breather.id,
      icon = breather.icon,
      headline = breather.headline,
      sub = breather.sub,
      bgColor = '#1B7A4A',
      textColor = '#FFF8F0',
      index = 0
    } = data;

    const iconHTML = Icons.get(icon, {
      color: textColor,
      size: '2em',
      className: 'bento-cell__icon'
    });

    return `
      <div
        class="bento-cell bento-cell--breather reveal"
        data-bento-id="${id}"
        data-bento-type="breather"
        data-bento-index="${index}"
        style="
          --cell-index: ${index};
          background-color: ${bgColor};
          color: ${textColor};
        "
      >
        ${iconHTML}
        <h3 class="bento-cell__headline">${headline}</h3>
        <p class="bento-cell__sub">${sub}</p>
      </div>
    `;
  }

  /* ─── API pública ───────────────────────────────────── */

  /**
   * render(data)
   * @param {object} data - Datos de la celda
   * @returns {string} HTML string
   *
   * Si data.type === 'breather', renderiza celda narrativa.
   * De lo contrario, renderiza celda con imagen y overlay.
   */
  function render(data) {
    if (!data) return '';

    if (data.type === 'breather') {
      return renderBreatherCell(data);
    }

    return renderMediaCell(data);
  }

  /**
   * resetBreatherPool()
   * Reinicia el índice round-robin (útil al re-renderizar).
   */
  function resetBreatherPool() {
    breatherIndex = 0;
  }

  return {
    render,
    resetBreatherPool
  };
})();
