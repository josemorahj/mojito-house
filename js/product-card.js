/**
 * @file product-card.js
 * @description Componente ProductCard con soporte para isFeatured y jerarquia
 *
 * Dependencias:
 * - getWhatsAppLink() : disponible en app.js (global)
 *
 * Uso:
 *   const html = ProductCard.render(productData);
 *   // o para featured:
 *   const html = ProductCard.render({ ...productData, isFeatured: true });
 */

const ProductCard = (() => {
  /* ─── Mapa de clases condicionales ──────────────────── */

  /**
   * generateClasses(config)
   * @param {object} config - ProductCardConfig
   * @returns {object} { container, image, badge, tagJerarquia, body, cta, title, description }
   */
  function generateClasses(config) {
    const { isFeatured, featuredLayout = 'vertical', jerarquia } = config;

    // ── Clases base (compartidas) ──────────────────────
    const base = {
      container: 'card card--producto',
      image: 'card__img',
      badge: '',
      tagJerarquia: 'card__jerarquia-tag',
      body: 'card__body',
      cta: 'btn btn-whatsapp card__btn',
      title: '',
      description: ''
    };

    // ── Si no es featured, devuelve base ───────────────
    if (!isFeatured) {
      return { ...base };
    }

    // ── Featured: layout condicional ───────────────────
    const layouts = {
      vertical: {
        container: 'card card--producto card--featured card--featured-vertical',
        image: 'card__img card__img--featured card__img--vertical',
        badge: 'card__badge card__badge--featured',
        tagJerarquia: 'card__jerarquia-tag card__jerarquia-tag--featured',
        body: 'card__body card__body--featured',
        cta: 'btn btn--whatsapp-primary card__btn card__btn--featured',
        title: 'card__title--featured',
        description: 'card__desc--featured'
      },
      horizontal: {
        container: 'card card--producto card--featured card--featured-horizontal',
        image: 'card__img card__img--featured card__img--horizontal',
        badge: 'card__badge card__badge--featured',
        tagJerarquia: 'card__jerarquia-tag card__jerarquia-tag--featured',
        body: 'card__body card__body--featured-h',
        cta: 'btn btn--whatsapp-primary card__btn card__btn--featured',
        title: 'card__title--featured',
        description: 'card__desc--featured'
      },
      hero: {
        container: 'card card--producto card--featured card--featured-hero',
        image: 'card__img card__img--featured card__img--hero',
        badge: 'card__badge card__badge--featured card__badge--hero',
        tagJerarquia: 'card__jerarquia-tag card__jerarquia-tag--featured card__jerarquia-tag--hero',
        body: 'card__body card__body--featured-hero',
        cta: 'btn btn--whatsapp-primary card__btn card__btn--featured card__btn--hero',
        title: 'card__title--featured card__title--hero',
        description: 'card__desc--featured card__desc--hero'
      }
    };

    return layouts[featuredLayout] || layouts.vertical;
  }

  /* ─── Render principal ──────────────────────────────── */

  /**
   * render(config)
   * @param {object} config - ProductCardConfig
   * @returns {string} HTML string del componente
   */
  function render(config) {
    const {
      id,
      name,
      description,
      image,
      category = '',
      isFeatured = false,
      featuredLayout = 'vertical',
      jerarquia = null,
      ctaOverride = null
    } = config;

    const classes = generateClasses(config);

    // -- Badge (solo si es featured) - icono SVG en lugar de emoji --
    const badgeIcon = typeof Icons !== 'undefined'
      ? Icons.get('flame', { color: 'inherit', size: '0.85em', className: 'badge-icon' })
      : '';
    const badgeHTML = isFeatured
      ? `<span class="${classes.badge}" aria-label="Producto destacado">${badgeIcon} Del Mes</span>`
      : '';

    // -- Jerarquia Tag: etiqueta comercial sobria (sin emojis) --
    const jerarquiaEtiquetas = {
      MasPedido: 'M\u00e1s pedido',
      FavoritoSemana: 'Favorito de la semana',
      Recomendado: 'Recomendado',
      EdicionEspecial: 'Edici\u00f3n especial'
    };
    const jerarquiaHTML = jerarquia && jerarquiaEtiquetas[jerarquia]
      ? `<span class="${classes.tagJerarquia}" aria-label="${jerarquiaEtiquetas[jerarquia]}">${jerarquiaEtiquetas[jerarquia]}</span>`
      : '';

    // -- CTA --
    let ctaHTML;
    if (ctaOverride) {
      ctaHTML = `
        <button
          class="${classes.cta}"
          data-whatsapp-template="${ctaOverride.action}"
          data-whatsapp-param="${ctaOverride.param || name}"
        >
          ${ctaOverride.label}
        </button>
      `;
    } else {
      ctaHTML = `
        <button
          class="${classes.cta}"
          data-whatsapp-template="catalogo"
          data-whatsapp-param="${name}"
        >
          ${isFeatured ? 'Pedir ahora' : 'Consultar sabor'}
        </button>
      `;
    }

    // -- HTML ensamblado --
    return `
      <article class="${classes.container}" data-product-id="${id}" data-category="${category}" data-featured="${isFeatured}">
        <div class="card__img-wrapper">
          ${badgeHTML}
          ${jerarquiaHTML}
          <img
            src="${image}"
            alt="${name}"
            class="${classes.image}"
            loading="${isFeatured ? 'eager' : 'lazy'}"
            width="400"
            height="300"
          >
        </div>
        <div class="${classes.body}">
          <h3 class="${classes.title}">${name}</h3>
          <p class="${classes.description}">${description}</p>
          ${ctaHTML}
        </div>
      </article>
    `;
  }
  return { render };
})();
