/**
 * Telón de entrada: la «S» se dibuja sobre grafito y el telón sube dejando ver
 * la portada. Es CSS puro (no espera a JS) y dura poco más de un segundo; sólo
 * sale la primera vez en cada sesión y nunca con movimiento reducido.
 */
const seenScript = `try{if(sessionStorage.getItem("satorus-intro")){document.documentElement.dataset.intro="seen"}else{sessionStorage.setItem("satorus-intro","1")}}catch(e){}`

export function IntroLoader() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: seenScript }} />
      <div className="il" aria-hidden="true">
        <span className="il-panel" />
        <span className="il-panel il-panel--lime" />
        <svg className="il-mark" viewBox="0 0 48 48" focusable="false">
          <path
            d="M36.5 10.8C30.2 5.8 18.1 5.7 11.8 12.4C5.7 18.9 11.8 23.9 24 23.9C36.5 23.9 42.3 29 36.2 35.8C30.4 42.2 18 42.4 10.7 36.7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="6.5"
            pathLength={1}
          />
          <circle cx="10.7" cy="36.7" r="4.2" fill="currentColor" />
        </svg>
      </div>
    </>
  )
}
