# Fontana Milano 1915 — A Man

Reinterpretazione luxury / quiet luxury della pagina prodotto **A Man** di [Fontana Milano 1915](https://www.fontanamilano1915.com/uomo/a-man): hero a tutto schermo, galleria editoriale, mini-cart laterale, ricerca a schermo intero, mega-menu con immagini, sezione editoriale “Il Mondo Fontana”, IT / EN.

**Sito online:** https://fico-azienda.github.io/fontana-milano-1915/

## Stack
React 19 · TypeScript · Vite · Tailwind CSS v4. Nessuna libreria di animazione: transizioni CSS (300–1100 ms, easing `cubic-bezier(.22,.7,.2,1)`), `IntersectionObserver` per i reveal, parallax leggero con `requestAnimationFrame`. Router a hash (compatibile con GitHub Pages). Font self-hosted (Cormorant Garamond + Inter).

```bash
npm install
npm run dev      # sviluppo
npm run build    # produzione → dist/
npm run images   # rigenera AVIF/WebP responsive da assets-src/
```

## Struttura
```
src/components   Header, MegaMenu, MobileMenu, Hero, ProductGallery, Lightbox, ProductInfo,
                 Accordion, MiniCart, SearchOverlay, EditorialSection, ProductRail, Footer, LanguageSelector
src/pages        Home, Product, Collection, Mondo, Bag/Checkout, Account/Wishlist, Service
src/lib          store (carrello, preferiti, lingua), i18n, router, hooks (dialog/focus-trap, reveal, parallax)
src/data         catalogo, navigazione, manifest immagini
assets-src       immagini originali del sito Fontana
scripts          ottimizzazione immagini (sharp)
```

## Note sui contenuti
- Immagini e testi (A Man, storia, workshop, special projects) provengono dal sito ufficiale Fontana; sono di proprietà del marchio. Progetto dimostrativo non ufficiale.
- **Prezzo (€ 2.450), dimensioni e materiali sono segnaposto**: il sito originale non li espone. Il colore “Grigio ardesia” è una denominazione descrittiva per le foto grigie della pagina originale.
- Carrello e preferiti sono salvati in `localStorage`. Checkout e Account sono pagine dimostrative: nessun dato viene inviato.
- Gli altri modelli in catalogo rimandano al sito Fontana.

## Performance & accessibilità
AVIF/WebP con `srcset`, preload dell'immagine hero, lazy loading, dimensioni intrinseche (niente CLS), JS ≈ 90 kB gzip. HTML semantico, skip link, focus visibile, dialog con focus trap ed Esc (menu, mini-cart, ricerca, lightbox), `aria-expanded` sul mega-menu e sugli accordion, `prefers-reduced-motion` rispettato.
