import { IntroOverlay } from './IntroOverlay'

/**
 * The home page's welcome screen (see IntroOverlay). The inline script runs as
 * the page is parsed, before the screen paints: if it was already seen this
 * visit, it never appears. Without JavaScript it is hidden altogether, and CSS
 * removes it after about five seconds even if something goes wrong.
 */
export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "try{sessionStorage.getItem('mx-intro')&&document.documentElement.classList.add('intro-seen')}catch(e){}" }} />
      <noscript>
        <style>{'#intro{display:none}'}</style>
      </noscript>
      <IntroOverlay />
    </>
  )
}
