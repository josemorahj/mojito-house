/**
 * @file icons.js
 * @description Banco centralizado de iconos SVG vectoriales.
 * API pública:  Icons.get('nombre', { color: '#hex', size: '24px' })
 *
 * Sustituye todos los emojis de sistema por iconos SVG profesionales
 * con estilo Phosphor Icons Duotone / Lucide.
 *
 * Uso:
 *   Icons.get('flame', { color: '#D4A84B', size: '20px' })
 *   // => <svg ...><use href="#icon-flame" color="#D4A84B" .../></svg>
 */

const Icons = (() => {
  /* ─── Banco de iconos disponibles ────────────────────── */
  // Cada icono es un <symbol> inline que se inyecta en un <svg> oculto
  // al cargar el módulo. Esto evita duplicar el sprite en el HTML.

  const ICONS = {
    flame: {
      viewBox: '0 0 24 24',
      paths: [
        // Llama principal (duotone feel con dos paths)
        { d: 'M12 2C12 2 8 6 8 10C8 13.3137 10.6863 16 14 16C17.3137 16 20 13.3137 20 10C20 6 16 4 12 2Z', fill: 'currentColor', opacity: '0.3' },
        { d: 'M12 2C12 2 8 6 8 10C8 13.3137 10.6863 16 14 16C14.5 16 14.5 16 14 16C14 17.5 13 19 11 19C9 19 8 17.5 8 16C8 18 9 21 12 22C15 21 16 18 16 16C16 13.5 14.5 12 14 10C13.5 8 12.5 6 12 2Z', fill: 'currentColor' }
      ]
    },
    star: {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z', fill: 'currentColor' }
      ]
    },
    calendar: {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M3 4H21V22H3V4Z', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
        { d: 'M16 2V6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M8 2V6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M3 10H21', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M8 14H8.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 14H12.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M16 14H16.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M8 18H8.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 18H12.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M16 18H16.01', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }
      ]
    },
    'arrow-right': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M5 12H19', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 5L19 12L12 19', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
      ]
    },
    /* ─── Iconos adicionales (para reemplazar más emojis) ─── */
    'gift': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M20 12V22H4V12', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M22 7H2V12H22V7Z', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M12 22V7', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C10 2 12 7 12 7Z', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C14 2 12 7 12 7Z', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
      ]
    },
    'handshake': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M20 14C20 14 17 12 14 12C11 12 9 14 4 12C3 11.5 2 11 1 12', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M20 14L22 20', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M4 12L2 18', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M6 18H18', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M8 22H16', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 14C14 14 16 16 16 18', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M8 18C8 16 9.5 14 12 14', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }
      ]
    },
    'champagne': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M6 8L18 8', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M7 8C7 8 8 3 9 2C10 1 14 1 15 2C16 3 17 8 17 8', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M9 14H11L10 20H8L9 14Z', fill: 'currentColor', opacity: '0.3' },
        { d: 'M13 14H15L14 20H12L13 14Z', fill: 'currentColor', opacity: '0.3' },
        { d: 'M8 20H16', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M12 20V22', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }
      ]
    },
    'building': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M3 22V2H15V6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M21 22V10H15V22', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M7 6H9', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M7 10H9', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M7 14H9', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M11 6H13', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M11 10H13', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M11 14H13', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M17 14H19', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M17 18H19', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M7 18H13', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }
      ]
    },
    'home': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M3 12L12 3L21 12', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M5 10V20H19V10', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { d: 'M9 20V14H15V20', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
      ]
    },
    'zap': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M13 2L4 14H12L11 22L20 10H12L13 2Z', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
      ]
    },
    'sparkles': {
      viewBox: '0 0 24 24',
      paths: [
        { d: 'M12 3L14.5 9L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 9L12 3Z', fill: 'currentColor', opacity: '0.3' },
        { d: 'M5 5L7 7', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M19 17L21 19', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M5 19L7 17', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
        { d: 'M19 5L21 7', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }
      ]
    }
  };

  /* ─── Estado interno ──────────────────────────────────── */
  let spriteInitialized = false;

  /* ─── Inyectar sprite oculto en el DOM ────────────────── */
  function initSprite() {
    if (spriteInitialized) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'none';
    svg.classList.add('icon-sprite-js');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    Object.entries(ICONS).forEach(([name, icon]) => {
      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
      symbol.setAttribute('id', `icon-${name}`);
      symbol.setAttribute('viewBox', icon.viewBox);
      symbol.setAttribute('fill', 'none');

      icon.paths.forEach(pathData => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', pathData.d.startsWith('M') ? 'path' : 'path');
        el.setAttribute('d', pathData.d);
        if (pathData.fill) el.setAttribute('fill', pathData.fill);
        if (pathData.stroke) el.setAttribute('stroke', pathData.stroke);
        if (pathData.strokeWidth) el.setAttribute('stroke-width', pathData.strokeWidth);
        if (pathData.strokeLinecap) el.setAttribute('stroke-linecap', pathData.strokeLinecap);
        if (pathData.strokeLinejoin) el.setAttribute('stroke-linejoin', pathData.strokeLinejoin);
        if (pathData.opacity) el.setAttribute('opacity', pathData.opacity);
        symbol.appendChild(el);
      });

      defs.appendChild(symbol);
    });

    svg.appendChild(defs);
    document.body.prepend(svg);
    spriteInitialized = true;
  }

  /* ─── API principal: obtener HTML de un icono ────────── */

  /**
   * get(name, options)
   * @param {string} name - Nombre del icono ('flame', 'star', 'calendar', 'arrow-right', ...)
   * @param {object} [options] - Opciones de personalización
   * @param {string} [options.color] - Color CSS (hex, rgb, etc.). Por defecto 'currentColor'
   * @param {string} [options.size] - Tamaño en CSS units. Por defecto '1em'
   * @param {string} [options.className] - Clases adicionales para el SVG
   * @returns {string} HTML string del elemento <svg>
   */
  function get(name, options = {}) {
    const {
      color = 'currentColor',
      size = '1em',
      className = ''
    } = options;

    // Inicializar sprite si no se ha hecho
    if (!spriteInitialized) {
      initSprite();
    }

    const iconKey = `icon-${name}`;
    const cls = `icon icon--svg ${className}`.trim();

    return `
      <svg class="${cls}" width="${size}" height="${size}" aria-hidden="true" style="color: ${color};">
        <use href="#${iconKey}"></use>
      </svg>
    `.trim();
  }

  /**
   * getDOM(name, options)
   * Versión DOM (retorna un elemento SVG real, no string).
   * @param {string} name - Nombre del icono
   * @param {object} [options] - Opciones (color, size, className)
   * @returns {SVGSVGElement}
   */
  function getDOM(name, options = {}) {
    const {
      color = 'currentColor',
      size = '1em',
      className = ''
    } = options;

    if (!spriteInitialized) {
      initSprite();
    }

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', `icon icon--svg ${className}`.trim());
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('aria-hidden', 'true');
    svg.style.color = color;

    const use = document.createElementNS(ns, 'use');
    use.setAttribute('href', `#icon-${name}`);
    svg.appendChild(use);

    return svg;
  }

  /* ─── Helper: reemplazar emojis en un string por iconos ── */

  /**
   * replaceEmojis(text)
   * Reemplaza emojis comunes por iconos SVG en texto plano.
   * @param {string} text - Texto que puede contener emojis
   * @returns {string} Texto con emojis reemplazados por tags HTML de iconos
   */
  const EMOJI_MAP = {
    '🔥': { icon: 'flame', size: '1em' },
    '🍹': { icon: 'sparkles', size: '1em' },
    '🎉': { icon: 'sparkles', size: '1em' },
    '⚡': { icon: 'zap', size: '1em' },
    '🎂': { icon: 'gift', size: '1.2em' },
    '🤝': { icon: 'handshake', size: '1.2em' },
    '🥂': { icon: 'champagne', size: '1.2em' },
    '🏢': { icon: 'building', size: '1.2em' },
    '🏠': { icon: 'home', size: '1.2em' }
  };

  function replaceEmojis(text) {
    if (!text || typeof text !== 'string') return text;

    let result = text;
    Object.entries(EMOJI_MAP).forEach(([emoji, config]) => {
      if (result.includes(emoji)) {
        const iconHtml = Icons.get(config.icon, { size: config.size });
        result = result.split(emoji).join(iconHtml);
      }
    });
    return result;
  }

  /* ─── Inicialización automática ────────────────────────── */
  // El sprite se inyecta al primer uso (lazy), no al cargar el script.
  // Pero si el DOM ya está listo y se quiere precargar:
  function init() {
    initSprite();
  }

  /* ─── API pública ────────────────────────────────────── */
  return {
    get,
    getDOM,
    replaceEmojis,
    init
  };
})();

// Auto-inicializar el sprite al cargar el script si el DOM ya está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Icons.init());
} else {
  Icons.init();
}
