/**
 * @file breather-card.js
 * @description Componente BreatherCard — Banner Sólido.
 *
 * Renderiza un respiro visual de tipo "solid-banner":
 * un bloque de color sólido con headline, body texto y CTA.
 *
 * Dependencias:
 * - getWhatsAppLink() : disponible en app.js (global)
 * - Icons.get()       : disponible en js/icons.js (global)
 *
 * Uso:
 *   const html = BreatherCard.render(breatherData);
 *
 * Estructura esperada de breatherData:
 * {
 *   type: 'breather',
 *   variant: 'solid-banner',
 *   id: 'breather-sed-1',
 *   icon: 'flame',                    // <-- icono SVG en lugar de emoji
 *   headline: '¿Sed de algo más fuerte?',
 *   body: 'Revisa los packs grupales...',
 *   cta: 'Ver packs',
 *   ctaAction: 'promo',
 *   ctaParam: 'Packs grupales',
 *   bgColor: '#1B7A4A',
 *   textColor: '#FFF8F0',
 *   ctaColor: '#D4A84B'
 * }
 */

const BreatherCard = (() => {
  /* ─── Constantes BEM ────────────────────────────────── */
  const BEM = {
    container: 'card card--breather card--breather-solid',
    inner: 'card__breather-inner',
    headline: 'card__breather-headline',
    body: 'card__breather-body',
    cta: 'btn card__breather-cta'
  };

  /* ─── Render ─────────────────────────────────────────── */

  /**
   * render(config)
   * @param {object} config - Datos del breather (tipo solid-banner)
   * @returns {string} HTML string del componente
   */
  function render(config) {
    const {
      id = 'breather',
      icon = '',
      headline = '',
      body = '',
      cta = '',
      ctaAction = 'general',
      ctaParam = '',
      bgColor = '#1B7A4A',
      textColor = '#FFF8F0',
      ctaColor = '#D4A84B'
    } = config;

    const containerStyle = [
      `background-color: ${bgColor}`,
      `color: ${textColor}`
    ].join('; ');

    const ctaStyle = `background-color: ${ctaColor}; color: ${textColor};`;

    // Icono SVG vectorial (reemplaza emojis de sistema)
    const iconHTML = icon
      ? Icons.get(icon, { color: textColor, size: '1.6em', className: 'card__breather-icon' })
      : '';

    const headlineHTML = icon
      ? `${iconHTML} ${headline}`
      : headline;

    return `
      <article class="${BEM.container}" data-breather-id="${id}" data-breather-variant="solid-banner" style="${containerStyle}">
        <div class="${BEM.inner}">
          <h3 class="${BEM.headline}">${headlineHTML}</h3>
          <p class="${BEM.body}">${body}</p>
          <button
            class="${BEM.cta} btn-hover-effect"
            style="${ctaStyle}"
            data-whatsapp-template="${ctaAction}"
            data-whatsapp-param="${ctaParam}"
          >
            ${cta}
          </button>
        </div>
      </article>
    `;
  }

  /* ─── API Pública ───────────────────────────────────── */
  return { render };
})();
