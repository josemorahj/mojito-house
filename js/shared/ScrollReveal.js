/**
 * @file ScrollReveal.js
 * @description Wrapper reutilizable de IntersectionObserver para animaciones de entrada.
 *
 * Reemplaza el scroll-reveal legacy de app.js con un módulo desacoplado
 * que puede ser usado por cualquier componente (BentoCell, cards, títulos).
 *
 * Comportamiento:
 * - Un solo IntersectionObserver compartido (performance).
 * - rootMargin: '0px 0px -80px 0px' para activar 80px antes del viewport.
 * - Aplica clase 'reveal--visible' cuando el elemento intersecta.
 * - Desconecta el observer tras la activación (single-fire).
 * - Soporta threshold configurable y callback opcional.
 *
 * Uso:
 *   ScrollReveal.observe('.bento-cell');
 *   ScrollReveal.observe(el, { threshold: 0.2, onReveal: (el) => { ... } });
 *
 * Estructura BEM de clases:
 *   .reveal              ← estado base (opacity: 0, transform invisible)
 *   .reveal--visible     ← estado activo (opacity: 1, transform reset)
 *   .reveal--done        ← opcional: marca para no re-observar
 */

const ScrollReveal = (() => {
  /* ─── Config ────────────────────────────────────────── */
  const DEFAULTS = {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  /* ─── Estado interno ────────────────────────────────── */
  let observer = null;
  const observedElements = new WeakMap(); // el -> { config, isRevealed }

  /* ─── Crear/obtener observer singleton ──────────────── */
  function getObserver() {
    if (observer) return observer;

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const meta = observedElements.get(el);
        if (!meta || meta.isRevealed) return;

        // Marcar como revelado
        meta.isRevealed = true;
        el.classList.add('reveal--visible');

        // Callback opcional
        if (typeof meta.config.onReveal === 'function') {
          meta.config.onReveal(el);
        }

        // Desconectar este elemento (single-fire)
        observer.unobserve(el);
      });
    }, {
      rootMargin: DEFAULTS.rootMargin,
      threshold: DEFAULTS.threshold
    });

    return observer;
  }

  /* ─── API: observe ───────────────────────────────────── */

  /**
   * observe(target, options)
   * @param {string|Element|NodeList} target - Selector CSS, elemento DOM, o NodeList
   * @param {object} [options] - Opciones
   * @param {number} [options.threshold] - Umbral de intersección (0-1)
   * @param {string} [options.rootMargin] - Margen del root
   * @param {function} [options.onReveal] - Callback al revelarse
   */
  function observe(target, options = {}) {
    const config = { ...DEFAULTS, ...options };
    const obs = getObserver();

    // Normalizar target a array de elementos
    let elements = [];
    if (typeof target === 'string') {
      elements = [...document.querySelectorAll(target)];
    } else if (target instanceof Element) {
      elements = [target];
    } else if (target instanceof NodeList || Array.isArray(target)) {
      elements = [...target];
    } else {
      console.warn('ScrollReveal.observe: target inválido', target);
      return;
    }

    elements.forEach((el) => {
      if (!el || observedElements.has(el)) return;

      // Estado inicial
      el.classList.add('reveal');

      // Guardar metadata
      observedElements.set(el, { config, isRevealed: false });

      // Observar
      obs.observe(el);
    });
  }

  /* ─── API: refresh ───────────────────────────────────── */
  // Re-observa elementos que aún no se han revelado
  // Útil después de renderizado dinámico
  function refresh(selector = '.reveal:not(.reveal--visible)') {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      if (!observedElements.has(el)) {
        observe(el);
      }
    });
  }

  /* ─── API: destroy ───────────────────────────────────── */
  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  /* ─── API: init (alias para arranque global) ──────────── */
  function init(selector = '.reveal') {
    observe(selector);
  }

  /* ─── API pública ───────────────────────────────────── */
  return {
    observe,
    refresh,
    destroy,
    init
  };
})();

// Auto-observar al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ScrollReveal.init());
} else {
  ScrollReveal.init();
}
