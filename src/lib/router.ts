import { useEffect, useState } from 'react'

/** Router minimale a hash: nessuna dipendenza e compatibile con GitHub Pages. */
const read = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path] = raw.split('?')
  return path.startsWith('/') ? path : '/' + path
}

export function usePath() {
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => setPath(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return path
}

export const href = (path: string) => '#' + path
export const go = (path: string) => { window.location.hash = path }
