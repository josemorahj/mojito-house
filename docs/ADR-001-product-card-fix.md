# ADR-001: Reversión de cambios incorrectos en ProductCard

**Estado:** Implementado  
**Fecha:** 2026-07-06  
**Contexto:** Corrección post-auditoría — reversión de un "bug fix" aplicado por error.

---

## Decisión

Revertir 3 cambios de comportamiento en `js/product-card.js` que fueron introducidos
erróneamente como parte de un supuesto "fix de JSX", y eliminar el byte BOM (UTF-8 BOM)
que se agregó sin necesidad al inicio del archivo. Se conserva íntegramente la funcionalidad
de `jerarquia` (etiqueta comercial) que sí fue agregada a propósito.

---

## Por qué

### Diagnóstico original erróneo

El commit anterior diagnosticó como "bug de JSX" lo que en realidad era sintaxis JS
perfectamente válida: el uso de un operador ternario `${cond ? a : b}` dentro de un
template literal. En JavaScript (Vanilla JS), los template literals aceptan cualquier
expresión JS entre `${}`. No hay JSX en este proyecto — no hay React, ni Babel, ni
transpilación.

El "fix" que se aplicó por error modificó 3 líneas que **no tenían relación con ningún bug**:

1. **Texto del botón CTA (default):**  
   ❌ Cambió de `${isFeatured ? 'Pedir ahora' : 'Consultar sabor'}` a `'Consultar'`  
   ✅ Se revierte al ternario original, que muestra texto diferenciado para productos destacados.

2. **Atributo `loading` de la imagen:**  
   ❌ Cambió de `${isFeatured ? 'eager' : 'lazy'}` a `'lazy'`  
   ✅ Se revierte al ternario original para que los productos destacados carguen con prioridad.

3. **Fallback de `ctaOverride.param`:**  
   ❌ Cambió de `${ctaOverride.param || name}` a `${ctaOverride.param}`  
   ✅ Se restaura el fallback al nombre del producto, que es un safety net para cuando
      `ctaOverride.param` no está definido.

Adicionalmente, se agregó un **byte BOM (0xEF BB BF)** al inicio del archivo, innecesario
para archivos JS modernos servidos como UTF-8 sin BOM. Esto fue eliminado.

### Lo que se conserva

La funcionalidad de **jerarquía** (etiqueta comercial: MasPedido, FavoritoSemana, etc.)
se agregó a propósito en el mismo conjunto de cambios y **no se revierte**. Es una
característica legítima que:
- Ya estaba documentada en `product-card.types.js`
- Se usa desde `app.js` en el fallback de productos (`productosFallback[0].jerarquia`)
- Tiene estilos dedicados en `css/styles.css`
- No interfiere con el comportamiento del CTA ni del loading

---

## Qué se descartó

| Elemento | Decisión | Motivo |
|---|---|---|
| La feature `jerarquia` completa | Conservar | Agregada a propósito, documentada y funcional |
| Cambios cosméticos de comentarios (`// --` → `// ──`) | No revertir | No afectan comportamiento |
| Eliminación del comentario `/* ─── API Pública ─── */` | No revertir | No afecta comportamiento |
| BOM byte en `app.js` | Eliminado | Misma razón que en product-card.js |
| BOM byte en `product-card.types.js` | No se tocó | Fuera del alcance definido |

---

## Validación

### Evidencia de contenido final

El archivo `js/product-card.js` después de los cambios tiene:

- **Línea 127:** `data-whatsapp-param="${ctaOverride.param || name}"` — fallback restaurado
- **Línea 135:** `${isFeatured ? 'Pedir ahora' : 'Consultar sabor'}` — ternario restaurado
- **Línea 150:** `loading="${isFeatured ? 'eager' : 'lazy'}"` — ternario restaurado
- Sin BOM byte (los primeros 4 bytes son `47 42 42 10` = `/**\n`)
- `jerarquia` presente en `generateClasses()`, `render()`, y template HTML

### Vista de diff

```
git diff js/product-card.js
```

El diff contra HEAD (`1ab3efa`) muestra exclusivamente:
- Adición del field `jerarquia` en `generateClasses` y `render`
- Adición de `tagJerarquia` en los tres layouts (vertical, horizontal, hero)
- Adición del bloque `jerarquiaEtiquetas` y `jerarquiaHTML`
- Renderizado de `${jerarquiaHTML}` en el HTML ensamblado
- Cambios cosméticos en comentarios (`// --` en vez de `// ──`, eliminación de `API Pública`)
- **NO hay cambios** en las líneas de CTA, loading ni fallback de param

### Prueba visual

- Servidor HTTP levantado en `localhost:5500`
- Página principal (`index.html`) carga sin errores
- Todos los scripts JS se cargan en orden: icons.js → product-card.js → catalog-pipeline.js → breather-card.js → app.js
- Estructura HTML del catálogo renderiza correctamente con cards dinámicas
- El balance de llaves `{ }` en product-card.js y app.js es correcto (51/51 y 105/105 respectivamente)

---

## Historial para el próximo agente

Este ADR reemplaza a `engram-audit.md` como registro de decisiones. Si llegas aquí:

1. **No investigues un "bug de JSX" en product-card.js.** No existe. Fue un falso positivo.
2. **Los 3 cambios de comportamiento ya fueron revertidos.** No los toques.
3. **Jerarquía es intencional y está completa.** Los tags comerciales se renderizan desde
   `ProductCard.render()` si el producto tiene campo `jerarquia` con uno de los valores
   válidos (`MasPedido`, `FavoritoSemana`, `Recomendado`, `EdicionEspecial`).
4. **El CTA override funciona con fallback** (`ctaOverride.param || name`), así que
   `ctaOverride.param` puede omitirse y usará el nombre del producto.
5. **Los productos destacados cargan con `loading="eager"`** y los normales con `"lazy"`.
6. **No hay BOM bytes** en `product-card.js` ni `app.js`.
