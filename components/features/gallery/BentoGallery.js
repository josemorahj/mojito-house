/**
 * @file BentoGallery.js
 * @description Orquestador de la galería Bento Grid asimétrica.
 *
 * Pipeline de distribución:
 *   1. Recibe un array plano de imágenes (producto + social + contexto).
 *   2. Las clasifica por tipo y las intercala siguiendo un patrón narrativo
 *      (30% producto / 70% social + contexto + breathers).
 *   3. Asigna áreas nombradas (grid-template-areas) dinámicamente.
 *   4. Genera HTML con BentoCell y lo inyecta en el contenedor.
 *   5. Registra cada celda en ScrollReveal para animación de entrada.
 *
 * Dependencias:
 * - BentoCell.js   : render de cada celda individual
 * - ScrollReveal.js: IntersectionObserver wrapper
 * - gallery-bento.css : estilos del grid (7 cols desktop, 4 tablet, 2 mobile)
 *
 * Uso:
 *   BentoGallery.init('#galeria-grid', galeriaImagenes);
 *   // o
 *   const html = BentoGallery.render(galeriaImagenes);
 *   document.getElementById('galeria-grid').innerHTML = html;
 *   BentoGallery.observe();
 */

const BentoGallery = (() => {
  /* ─── Constantes de layout ───────────────────────────── */

  // ─── Banco de mockups para desarrollo / fallback ────────
  const MOCKUP_BANK = [
    { type: 'product', src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800', alt: 'Mojito clásico' },
    { type: 'social', src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800', alt: 'Evento social' },
    { type: 'product', src: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800', alt: 'Frutos rojos' },
    { type: 'context', src: 'https://images.unsplash.com/photo-1574366503941-a189b88e100f?auto=format&fit=crop&q=80&w=800', alt: 'Barra premium' },
    { type: 'social', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', alt: 'Celebración' },
    { type: 'product', src: 'https://images.unsplash.com/photo-1605270076410-a33bc3bb8835?auto=format&fit=crop&q=80&w=800', alt: 'Mojito tropical' }
  ];

  /**
   * normalizeData(data)
   * Convierte datos al formato que espera el pipeline Bento.
   * - `src` → `url` (formato mockup)
   * - Si no hay `title`, usa `alt`
   * - Si no hay `id`, genera uno negativo (marca = generado)
   * - Si no hay `type`, se deja null (el pipeline lo clasifica)
   */
  function normalizeData(data) {
    if (!data || data.length === 0) return [];
    return data.map((item, index) => ({
      id: item.id || -(index + 1),
      type: item.type || null,
      url: item.url || item.src || '',
      alt: item.alt || '',
      title: item.title || item.titulo || item.alt || '',
      category: item.category || item.categoria || ''
    }));
  }

  // Cada patrón es un array de áreas de 7 columnas × 2 filas.
  // Se repite cíclicamente para cubrir N items.
  // Leyenda:
  //   P = producto (compacto, 2×2)
  //   S = social (hero, 3×2 o 2×2)
  //   C = context (panorámico, 4×2)
  //   B = breather (respiro narrativo)
  //
  // ASCII layout de cada patrón:
  //
  // Patrón A:
  // ┌───────┬───────┬───────┬───────┬───────┬───────┬───────┐
  // │  P1   │  S1   │  S1   │  P2   │  P2   │  C1   │  C1   │
  // │       │       │       │       │       │  (an  │  (an  │
  // ├───────┼───────┼───────┼───────┼───────┤  ch o │  ch o │
  // │  P1   │  B1   │  S2   │  S2   │  S2   │  r a) │  r a) │
  // │       │       │       │       │       ├───────┼───────┤
  // │       │       │       │       │       │  C1   │  C1   │
  // └───────┴───────┴───────┴───────┴───────┴───────┴───────┘
  //
  // Patrón B:
  // ┌───────┬───────┬───────┬───────┬───────┬───────┬───────┐
  // │  S3   │  S3   │  S3   │  P3   │  B2   │  S4   │  S4   │
  // │       │       │       │       │       │       │       │
  // ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
  // │  P4   │  P4   │  S3   │  P3   │       │  S4   │  S4   │
  // │       │       │       │       │       │       │       │
  // ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
  // │  P4   │  P4   │  C2   │  C2   │  C2   │  C2   │  S5   │
  // │       │       │       │       │       │       │       │
  // └───────┴───────┴───────┴───────┴───────┴───────┴───────┘

  const AREA_PATTERNS = [
    // Patrón A: producto ancla + social hero + panorama
    [
      { area: 'p1', type: 'product',  cols: 2, rows: 2 },
      { area: 's1', type: 'social',   cols: 2, rows: 1 },
      { area: 'p2', type: 'product',  cols: 2, rows: 1 },
      { area: 'c1', type: 'context',  cols: 1, rows: 2 },
      { area: 'b1', type: 'breather', cols: 1, rows: 1 },
      { area: 's2', type: 'social',   cols: 3, rows: 1 }
    ],
    // Patrón B: social hero + breather + panorama
    [
      { area: 's3', type: 'social',   cols: 3, rows: 2 },
      { area: 'p3', type: 'product',  cols: 2, rows: 2 },
      { area: 'b2', type: 'breather', cols: 1, rows: 1 },
      { area: 's4', type: 'social',   cols: 2, rows: 2 },
      { area: 'p4', type: 'product',  cols: 2, rows: 1 },
      { area: 'c2', type: 'context',  cols: 4, rows: 1 },
      { area: 's5', type: 'social',   cols: 1, rows: 1 }
    ]
  ];

  // Proporción: 30% producto, 50% social, 20% context + breathers
  // Se intercalan para que el usuario nunca vea 2 productos seguidos.
  const TYPE_DISTRIBUTION = ['social', 'product', 'social', 'social', 'context', 'social', 'breather'];

  /* ─── Estado interno ────────────────────────────────── */
  let container = null;
  let currentData = [];

  /* ─── Mapper: distribuir datos en áreas ──────────────── */

  /**
   * mapToGridAreas(data)
   * @param {Array} data - Array plano de objetos { id, url, alt, title, category, type }
   * @returns {Array} Array enriquecido: [{ areaName, rowStart, colStart, ...cellData }]
   *
   * Algoritmo:
   * 1. Clasificar items por tipo (product, social, context).
   * 2. Recorrer patrones de áreas cíclicamente.
   * 3. Asignar items reales a las áreas según su tipo.
   * 4. Las áreas 'breather' se generan automáticamente.
   * 5. Si no hay suficientes sociales/product/context, se insertan breathers.
   */
  function mapToGridAreas(data) {
    if (!data || data.length === 0) return [];

    // Clasificar
    const products = data.filter((d) => d.type === 'product');
    const socials = data.filter((d) => d.type === 'social');
    const contexts = data.filter((d) => d.type === 'context');
    // Items sin tipo explícito → se asignan según TYPE_DISTRIBUTION
    const untyped = data.filter((d) => !d.type || !['product', 'social', 'context'].includes(d.type));

    // Consumidores (shift para FIFO)
    let pIdx = 0, sIdx = 0, cIdx = 0, uIdx = 0;
    const nextProduct = () => products[pIdx++] || null;
    const nextSocial = () => socials[sIdx++] || null;
    const nextContext = () => contexts[cIdx++] || null;
    const nextUntyped = () => {
      // Asignar tipo según distribución si no tiene
      const item = untyped[uIdx++];
      if (item) {
        const typeIndex = (uIdx - 1) % TYPE_DISTRIBUTION.length;
        item.type = TYPE_DISTRIBUTION[typeIndex];
      }
      return item || null;
    };

    const result = [];
    let globalIndex = 0;
    let breatherCount = 0;

    // Recorrer patrones cíclicamente hasta cubrir todos los datos
    const maxIterations = Math.ceil(data.length / 6) + 2; // safety
    for (let iter = 0; iter < maxIterations; iter++) {
      const pattern = AREA_PATTERNS[iter % AREA_PATTERNS.length];
      let patternUsed = false;

      for (const slot of pattern) {
        // Si ya cubrimos todos los datos, salir
        if (result.length >= data.length && breatherCount > 0) break;

        let cellData = null;

        switch (slot.type) {
          case 'product':
            cellData = nextProduct() || nextUntyped();
            if (!cellData) {
              // Si no hay más productos, meter breather
              cellData = { type: 'breather' };
              breatherCount++;
            } else {
              cellData.type = 'product';
            }
            break;

          case 'social':
            cellData = nextSocial() || nextUntyped();
            if (!cellData) {
              cellData = { type: 'breather' };
              breatherCount++;
            } else {
              cellData.type = 'social';
            }
            break;

          case 'context':
            cellData = nextContext() || nextUntyped();
            if (!cellData) {
              cellData = { type: 'breather' };
              breatherCount++;
            } else {
              cellData.type = 'context';
            }
            break;

          case 'breather':
            cellData = { type: 'breather' };
            breatherCount++;
            break;
        }

        if (cellData) {
          // Calcular grid position
          const { area, cols, rows } = slot;
          const colSpan = cols;
          const rowSpan = rows;

          result.push({
            ...cellData,
            areaName: area,
            colSpan,
            rowSpan,
            index: globalIndex++
          });

          patternUsed = true;
        }
      }

      if (!patternUsed) break;

      // Si ya no hay más datos de ningún tipo, terminamos
      const remaining = (products.length - pIdx) + (socials.length - sIdx) +
                        (contexts.length - cIdx) + (untyped.length - uIdx);
      if (remaining <= 0 && breatherCount > 0) break;
    }

    return result;
  }

  /* ─── Generar grid-template-areas desde celdas mapeadas ── */

  /**
   * generateGridTemplate(mappedCells)
   * @param {Array} mappedCells - Array de objetos con { areaName, colSpan, rowSpan }
   * @returns {object} { gridTemplateAreas, gridTemplateRows, cellStyles }
   *
   * Construye strings CSS para grid-template-areas y grid-template-rows
   * basados en la posición acumulativa de cada celda.
   *
   * Estrategia:
   * 1. Track de columnas usadas por fila.
   * 2. Asignar areaName a cada celda.
   * 3. Generar string CSS de áreas.
   * 4. Generar estilos inline para cada celda (grid-column, grid-row).
   */
  function generateGridTemplate(mappedCells) {
    if (!mappedCells || mappedCells.length === 0) {
      return {
        gridTemplateAreas: '',
        gridTemplateRows: 'auto',
        cellStyles: []
      };
    }

    const COLS = 7;
    const grid = []; // grid[row][col] = areaName
    const cellStyles = [];

    // Inicializar grid vacío (máximo 20 filas para cubrir cualquier caso)
    const MAX_ROWS = 30;
    for (let r = 0; r < MAX_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = null;
      }
    }

    // Colocar cada celda en la primera posición disponible
    mappedCells.forEach((cell) => {
      const { areaName, colSpan, rowSpan } = cell;
      let placed = false;

      for (let r = 0; r < MAX_ROWS && !placed; r++) {
        for (let c = 0; c <= COLS - colSpan && !placed; c++) {
          // Verificar si el espacio está libre
          let free = true;
          for (let dr = 0; dr < rowSpan && free; dr++) {
            for (let dc = 0; dc < colSpan && free; dc++) {
              if (grid[r + dr][c + dc] !== null) {
                free = false;
              }
            }
          }

          if (free) {
            // Ocupar espacio
            for (let dr = 0; dr < rowSpan; dr++) {
              for (let dc = 0; dc < colSpan; dc++) {
                grid[r + dr][c + dc] = areaName;
              }
            }

            cellStyles.push({
              areaName,
              gridColumn: `${c + 1} / ${c + colSpan + 1}`,
              gridRow: `${r + 1} / ${r + rowSpan + 1}`
            });

            placed = true;
          }
        }
      }

      if (!placed) {
        console.warn(`BentoGallery: no se pudo colocar celda ${areaName} (${colSpan}×${rowSpan})`);
        cellStyles.push({
          areaName,
          gridColumn: 'auto',
          gridRow: 'auto'
        });
      }
    });

    // Encontrar filas usadas
    let usedRows = 0;
    for (let r = 0; r < MAX_ROWS; r++) {
      let rowUsed = false;
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] !== null) {
          rowUsed = true;
          break;
        }
      }
      if (rowUsed) usedRows = r + 1;
    }

    // Generar string de template areas
    const areaRows = [];
    for (let r = 0; r < usedRows; r++) {
      const rowParts = [];
      let currentArea = null;
      let count = 0;

      for (let c = 0; c < COLS; c++) {
        const area = grid[r][c] || '.';
        if (area === currentArea) {
          count++;
        } else {
          if (currentArea !== null) {
            rowParts.push(currentArea);
          }
          currentArea = area;
          count = 1;
        }
      }
      if (currentArea !== null) {
        rowParts.push(currentArea);
      }

      areaRows.push(`"${rowParts.join(' ')}"`);
    }

    const gridTemplateAreas = areaRows.join('\n    ');
    const gridTemplateRows = `repeat(${usedRows}, auto)`;

    return {
      gridTemplateAreas,
      gridTemplateRows,
      cellStyles
    };
  }

  /* ─── Renderizar HTML completo ───────────────────────── */

  /**
   * render(data)
   * @param {Array} data - Array de objetos de imagen
   * @returns {string} HTML string del grid Bento completo
   *
   * Flujo:
   * 1. Resetear pool de breathers.
   * 2. Mapear datos a áreas del grid.
   * 3. Generar template CSS.
   * 4. Renderizar cada celda con BentoCell.
   * 5. Ensamblar grid.
   */
  function render(data) {
    BentoCell.resetBreatherPool();

    const mapped = mapToGridAreas(data || []);
    if (mapped.length === 0) {
      return '<p class="bento-empty">Galería próximamente.</p>';
    }

    const { gridTemplateAreas, gridTemplateRows, cellStyles } = generateGridTemplate(mapped);

    // Mapa de estilos por areaName
    const styleMap = {};
    cellStyles.forEach((s) => {
      styleMap[s.areaName] = s;
    });

    // Renderizar cada celda
    const cellsHTML = mapped.map((cell) => {
      const style = styleMap[cell.areaName] || {};
      const cellHTML = BentoCell.render(cell);

      // Inyectar estilos inline de grid position
      // Reemplazar atributo style del contenedor
      const positionStyles = [
        style.gridColumn ? `grid-column: ${style.gridColumn};` : '',
        style.gridRow ? `grid-row: ${style.gridRow};` : ''
      ].filter(Boolean).join(' ');

      if (positionStyles) {
        // Insertar positionStyles en el style existente
        return cellHTML.replace(
          /style="([^"]*)"/,
          (match, existing) => `style="${existing} ${positionStyles}"`
        );
      }

      return cellHTML;
    }).join('');

    // Ensamblar grid completo
    return `
      <div
        class="bento-gallery"
        style="
          grid-template-areas:
            ${gridTemplateAreas};
          grid-template-rows: ${gridTemplateRows};
        "
      >
        ${cellsHTML}
      </div>
    `;
  }

  /* ─── Observar celdas con ScrollReveal ───────────────── */

  function observe() {
    // Observar todas las celdas dentro del contenedor
    const selector = container
      ? `${container} .bento-cell.reveal`
      : '.bento-cell.reveal';

    ScrollReveal.observe(selector);
  }

  /* ─── API principal: init ─────────────────────────────── */

  /**
   * init(containerSelector, data)
   * @param {string} containerSelector - Selector CSS del contenedor del grid
   * @param {Array} data - Array de objetos de imagen
   *
   * Renderiza la galería Bento completa en el contenedor
   * y activa ScrollReveal para las animaciones de entrada.
   */
  function init(containerSelector, data) {
    container = document.querySelector(containerSelector);
    if (!container) {
      console.warn(`BentoGallery: no se encontró el contenedor "${containerSelector}"`);
      return;
    }

    // Fallback: si no hay datos o está vacío, usar mockup bank
    const source = (data && data.length > 0) ? data : MOCKUP_BANK;
    currentData = normalizeData(source);

    const html = render(currentData);
    container.innerHTML = html;

    // Activar animaciones de entrada
    observe();
  }

  /**
   * refresh(data)
   * Re-renderiza con nuevos datos, manteniendo el mismo contenedor.
   * @param {Array} data - Nuevo array de datos
   */
  function refresh(data) {
    if (!container) {
      console.warn('BentoGallery: no hay contenedor. Usa init() primero.');
      return;
    }

    const source = (data && data.length > 0) ? data : MOCKUP_BANK;
    currentData = normalizeData(source);
    const html = render(currentData);
    container.innerHTML = html;

    observe();
  }

  /* ─── API pública ───────────────────────────────────── */
  return {
    init,
    refresh,
    render,
    observe,
    mapToGridAreas,
    normalizeData,
    MOCKUP_BANK
  };
})();
