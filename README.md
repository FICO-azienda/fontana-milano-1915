# Fontana Milano 1915 — A Man

Reinterpretazione luxury / quiet luxury della pagina prodotto **A Man** di [Fontana Milano 1915](https://www.fontanamilano1915.com/uomo/a-man): hero a tutto schermo, galleria editoriale, mini-cart laterale, ricerca a schermo intero, mega-menu con immagini, sezione editoriale “Il Mondo Fontana”, IT / EN.

**Sito online:** https://fico-azienda.github.io/fontana-milano-1915/

## Stack
React 19 · TypeScript · Vite · Tailwind CSS v4. Nessuna libreria di animazione: transizioni CSS (300–1100 ms, easing `cubic-bezier(.22,.7,.2,1)`), `IntersectionObserver` per i reveal, parallax leggero con `requestAnimationFrame`. Router a hash (compatibile con GitHub Pages). Font self-hosted (Cormorant Garamond + Inter).

```bash
npm install
npm run dev      # sviluppo
npm run build    # produzione → dist/
npm run images   # rigenera AVIF/WebP responsive da assets-src/ (hero, editoriale, miniature)
```

## Schede prodotto
Ogni borsa (9 Uomo + 20 Donna) ha la sua pagina: `#/uomo/<slug>` e `#/donna/<slug>`, con gli stessi slug del sito Fontana.
Testi, foto e colori sono importati dal sito originale con due script (Python + Pillow, Node + sharp):
```bash
python3 scripts/import_products.py     # scarica testi IT/EN e foto in assets-src/products (non versionato)
python3 scripts/build_products.py      # raggruppa le foto per colore → scripts/product-selection.json
node scripts/optimize-products.mjs     # ritaglia sul soggetto e genera AVIF/WebP in public/img
```
I colori sono stimati dal colore dominante delle foto e nominati in modo descrittivo (es. “Tortora”, “Blu notte”).

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
- **Prezzi, dimensioni e materiali sono segnaposto** (A Man € 2.450, ecc.): il sito originale non li espone. Per gli altri modelli le misure sono “su richiesta”. Il colore “Grigio ardesia” è una denominazione descrittiva per le foto grigie della pagina originale.
- Carrello e preferiti sono salvati in `localStorage`. Checkout e Account sono pagine dimostrative: nessun dato viene inviato.

## Performance & accessibilità
AVIF/WebP con `srcset`, preload dell'immagine hero, lazy loading, dimensioni intrinseche (niente CLS), JS ≈ 90 kB gzip. HTML semantico, skip link, focus visibile, dialog con focus trap ed Esc (menu, mini-cart, ricerca, lightbox), `aria-expanded` sul mega-menu e sugli accordion, `prefers-reduced-motion` rispettato.
