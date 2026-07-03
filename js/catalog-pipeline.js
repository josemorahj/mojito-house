/**
 * @file catalog-pipeline.js
 * @description Pipeline de intercalado de "respiros visuales" en el catálogo.
 *
 * Toma un array de productos y devuelve un array mixto
 * (productos + breathers) según una estrategia de intercalado.
 *
 * Cada breather se representa como un objeto con:
 *   { type: 'breather', variant: 'solid-banner', ...props }
 *
 * Uso:
 *   const pipeline = CatalogPipeline({ interval: 3 });
 *   const mixed = pipeline.inject(products);
 */

const CatalogPipeline = (() => {
  /* ─── Config por defecto ────────────────────────────── */
  const DEFAULTS = {
    interval: 3 // cada 3 productos, inyectar un breather
  };

  /* ─── Pool de respiros disponibles ──────────────────── */
  // Se puede extender con más variantes en el futuro.
  const BREATHER_POOL = {
    'solid-banner': [
      {
        type: 'breather',
        variant: 'solid-banner',
        id: 'breather-sed-1',
        headline: '¿Sed de algo más fuerte?',
        icon: 'flame',
        body: 'Revisa los packs grupales y lleva la previa a otro nivel.',
        cta: 'Ver packs',
        ctaAction: 'promo',
        ctaParam: 'Packs grupales',
        bgColor: '#1B7A4A',
        textColor: '#FFF8F0',
        ctaColor: '#D4A84B'
      },
      {
        type: 'breather',
        variant: 'solid-banner',
        id: 'breather-sed-2',
        headline: '¿Ya conoces el Mojito del Mes?',
        icon: 'sparkles',
        body: 'Edición limitada con maracuyá y jengibre. Probálo antes de que se acabe.',
        cta: 'Lo quiero',
        ctaAction: 'catalogo',
        ctaParam: 'Mojito del Mes',
        bgColor: '#A3D977',
        textColor: '#1A1A2E',
        ctaColor: '#1B7A4A'
      },
      {
        type: 'breather',
        variant: 'solid-banner',
        id: 'breather-sed-3',
        headline: '¿Evento próximamente?',
        icon: 'sparkles',
        body: 'Cotiza tu barra de mojitos artesanales y convertí cualquier ocasión en fiesta.',
        cta: 'Cotizar',
        ctaAction: 'evento',
        ctaParam: 'Barra de mojitos',
        bgColor: '#D4A84B',
        textColor: '#1A1A2E',
        ctaColor: '#1B7A4A'
      },
      {
        type: 'breather',
        variant: 'solid-banner',
        id: 'breather-sed-4',
        headline: '2x1 los miércoles',
        icon: 'zap',
        body: 'Vení con alguien especial y disfrutá dos mojitos al precio de uno.',
        cta: 'Consultar',
        ctaAction: 'promo',
        ctaParam: '2x1 miércoles',
        bgColor: '#1A1A2E',
        textColor: '#FFF8F0',
        ctaColor: '#D4A84B'
      }
    ]
  };

  /* ─── Round-Robin simple para variar respiros ────────── */
  function createRoundRobin(pool) {
    let index = 0;
    return function next() {
      const item = pool[index % pool.length];
      index++;
      return { ...item };
    };
  }

  /* ─── Inyectar respiros en el array ──────────────────── */
  function inject(productsArray, options = {}) {
    const config = { ...DEFAULTS, ...options };
    const { interval, variant = 'solid-banner' } = config;

    if (!productsArray || productsArray.length === 0) {
      return [];
    }

    const pool = BREATHER_POOL[variant];
    if (!pool || pool.length === 0) {
      // Sin pool disponible, devolver productos tal cual
      console.warn(`CatalogPipeline: no hay respiros para la variante "${variant}"`);
      return [...productsArray];
    }

    const nextBreather = createRoundRobin(pool);
    const result = [];

    for (let i = 0; i < productsArray.length; i++) {
      result.push(productsArray[i]);

      // Inyectar breather después de cada `interval` productos
      // (empezando desde el interval-ésimo)
      if ((i + 1) % interval === 0 && i < productsArray.length - 1) {
        result.push(nextBreather());
      }
    }

    return result;
  }

  /* ─── API Pública ───────────────────────────────────── */
  return { inject };
})();
