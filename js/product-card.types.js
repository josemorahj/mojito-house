/**
 * @file product-card.types.js
 * @description Contratos de datos para el componente ProductCard
 * 
 * Este archivo sirve como documentación viva de tipos.
 * En un ecosistema JS vanilla se usa JSDoc para type-checking.
 * Si se migra a TypeScript en el futuro, migrar interfaces directamente.
 */

/**
 * @typedef {'vertical' | 'horizontal' | 'hero'} FeaturedLayout
 * 
 * vertical   → card ocupa 1 col, 2 rows (mobile) | 2 cols, 1 row (desktop)
 * horizontal → card ocupa 1 col, 1 row (mobile) | 2 cols, 1 row (desktop)
 * hero       → card ocupa 1 col, 2 rows (mobile) | 2 cols, 2 rows (desktop)
 */

/**
 * @typedef {Object} CTAOverride
 * @property {string} label       - Texto del botón (ej: "Pedir ahora")
 * @property {'primary' | 'whatsapp' | 'outline'} variant - Variante visual
 * @property {string} action      - Template de WhatsApp (ej: 'catalogo')
 * @property {string} param       - Parámetro para el template
 */

/**
 * @typedef {Object} ProductCardConfig
 * @property {number} id                  - ID único del producto
 * @property {string} name                - Nombre del producto
 * @property {string} description         - Descripción breve
 * @property {string} category            - Categoría (clasico, frutal, tropical)
 * @property {string} image               - URL única de alta resolución
 * @property {boolean} [isFeatured]       - Si es producto destacado (Mojito del Mes)
 * @property {FeaturedLayout} [featuredLayout] - Layout para featured (default: 'vertical')
 * @property {CTAOverride} [ctaOverride]  - Override completo del CTA
 */

// Exportación nominal para documentación
export const ProductCardPropTypes = {
  id: 'number',
  name: 'string',
  description: 'string',
  category: 'string',
  image: 'string',
  isFeatured: 'boolean?',
  featuredLayout: '"vertical" | "horizontal" | "hero"?',
  ctaOverride: 'CTAOverride?'
};
