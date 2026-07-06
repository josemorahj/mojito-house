/**
 * @file product-card.types.js
 * @description Contratos de datos para el componente ProductCard
 * 
 * Este archivo sirve como documentaci\u00f3n viva de tipos.
 * En un ecosistema JS vanilla se usa JSDoc para type-checking.
 * Si se migra a TypeScript en el futuro, migrar interfaces directamente.
 */

/**
 * @typedef {'vertical' | 'horizontal' | 'hero'} FeaturedLayout
 * 
 * vertical   \u2192 card ocupa 1 col, 2 rows (mobile) | 2 cols, 1 row (desktop)
 * horizontal \u2192 card ocupa 1 col, 1 row (mobile) | 2 cols, 1 row (desktop)
 * hero       \u2192 card ocupa 1 col, 2 rows (mobile) | 2 cols, 2 rows (desktop)
 */

/**
 * @typedef {Object} CTAOverride
 * @property {string} label       - Texto del bot\u00f3n (ej: "Pedir ahora")
 * @property {'primary' | 'whatsapp' | 'outline'} variant - Variante visual
 * @property {string} action      - Template de WhatsApp (ej: 'catalogo')
 * @property {string} param       - Par\u00e1metro para el template
 */

/**
 * @typedef {'MasPedido' | 'FavoritoSemana' | 'Recomendado' | 'EdicionEspecial'} JerarquiaTag
 */

/**
 * @typedef {Object} ProductCardConfig
 * @property {number} id                  - ID \u00fanico del producto
 * @property {string} name                - Nombre del producto
 * @property {string} description         - Descripci\u00f3n breve
 * @property {string} category            - Categor\u00eda (clasico, frutal, tropical)
 * @property {string} image               - URL \u00fanica de alta resoluci\u00f3n
 * @property {boolean} [isFeatured]       - Si es producto destacado (Mojito del Mes)
 * @property {FeaturedLayout} [featuredLayout] - Layout para featured (default: 'vertical')
 * @property {CTAOverride} [ctaOverride]  - Override completo del CTA
 * @property {JerarquiaTag} [jerarquia]   - Etiqueta de jerarqu\u00eda comercial
 */

// Exportaci\u00f3n nominal para documentaci\u00f3n
export const ProductCardPropTypes = {
  id: 'number',
  name: 'string',
  description: 'string',
  category: 'string',
  image: 'string',
  isFeatured: 'boolean?',
  featuredLayout: '"vertical" | "horizontal" | "hero"?',
  ctaOverride: 'CTAOverride?',
  jerarquia: '"MasPedido" | "FavoritoSemana" | "Recomendado" | "EdicionEspecial"?'
};
