import { useEffect } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MiniCart } from './components/MiniCart'
import { MobileMenu } from './components/MobileMenu'
import { SearchOverlay } from './components/SearchOverlay'
import { Cta } from './components/Cta'
import { usePath } from './lib/router'
import { useStore } from './lib/store'
import { Account, Wishlist } from './pages/Account'
import { Bag, Checkout } from './pages/Bag'
import { Collection } from './pages/Collection'
import { Home } from './pages/Home'
import { Mondo } from './pages/Mondo'
import { Product } from './pages/Product'
import { findProduct } from './data/products'
import { Service } from './pages/Service'

function NotFound() {
  const { t } = useStore()
  return (
    <main id="main" tabIndex={-1} className="grid min-h-[80svh] place-items-center px-5 pt-[var(--header-h)] text-center">
      <div>
        <h1 className="display text-[48px] md:text-[80px]">{t('notfound')}</h1>
        <div className="mt-10 flex justify-center"><Cta href="#/">{t('back')}</Cta></div>
      </div>
    </main>
  )
}

export default function App() {
  const path = usePath()
  const { t, dispatch } = useStore()
  const [, root, sub] = path.split('/')

  // ad ogni cambio pagina: chiudi i pannelli e torna in cima (o alla sezione richiesta)
  useEffect(() => {
    dispatch({ t: 'menu', v: false })
    dispatch({ t: 'search', v: false })
    dispatch({ t: 'mini', v: false })
    const target = root === 'il-mondo-fontana' && sub ? document.getElementById('sec-' + sub) : null
    window.setTimeout(() => {
      if (target || (root === 'il-mondo-fontana' && sub && document.getElementById('sec-' + sub))) {
        document.getElementById('sec-' + sub)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      }
    }, 30)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  let page
  switch (root) {
    case '': page = <Home />; break
    case 'uomo':
    case 'donna': {
      const prod = sub ? findProduct(sub) : undefined
      const gender = root === 'uomo' ? 'men' : 'women'
      page = prod && prod.gender === gender ? <Product product={prod} /> : sub ? <NotFound /> : <Collection scope={gender} />
      break
    }
    case 'collezioni': page = <Collection scope="all" />; break
    case 'il-mondo-fontana': page = <Mondo />; break
    case 'borsa': page = <Bag />; break
    case 'checkout': page = <Checkout />; break
    case 'account': page = <Account />; break
    case 'preferiti': page = <Wishlist />; break
    case 'client-service': page = <Service section={sub} />; break
    default: page = <NotFound />
  }

  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.scrollIntoView(); (document.getElementById('main') as HTMLElement | null)?.focus() }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory">
        {t('util.skip')}
      </a>
      <Header overHero={root === ''} path={path} />
      <MobileMenu />
      <SearchOverlay />
      <MiniCart />
      <div key={path.split('/').slice(0, 3).join('/')} className="fade-in">{page}</div>
      <Footer />
    </>
  )
}
