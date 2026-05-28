"use client"

import { useRef } from "react"

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    formRef.current?.querySelector<HTMLElement>(".contacto__sent")?.classList.add("on")
  }

  return (
    <section className="contacto" id="contacto">
      <div className="container contacto__grid">
        <div className="contacto__left">
          <span className="eyebrow"><span className="eyebrow__dot"></span> 05 / HABLEMOS</span>
          <h2 className="section-title">Cuéntanos qué<br/><em className="serif">te frena</em>.</h2>
          <p className="section-lede">Una llamada de 30 minutos. Sin venta, sin compromiso. Salimos con un diagnóstico y, si encaja, una propuesta concreta en 5 días.</p>

          <div className="contacto__info">
            <div>
              <span className="mono small dim">// email</span>
              <a href="mailto:hola@satorus.es">hola@satorus.es</a>
            </div>
            <div>
              <span className="mono small dim">// teléfono</span>
              <a href="tel:+34900000000">+34 900 000 000</a>
            </div>
            <div>
              <span className="mono small dim">// oficina</span>
              <span>Alicante, ES · remoto-friendly</span>
            </div>
          </div>
        </div>

        <form className="contacto__form" onSubmit={handleSubmit} ref={formRef}>
          <div className="field">
            <label className="mono small dim" htmlFor="f-name">/ nombre</label>
            <input id="f-name" type="text" placeholder="Cómo te llamamos" />
          </div>
          <div className="field">
            <label className="mono small dim" htmlFor="f-co">/ empresa</label>
            <input id="f-co" type="text" placeholder="Nombre de la empresa" />
          </div>
          <div className="field">
            <label className="mono small dim" htmlFor="f-mail">/ email</label>
            <input id="f-mail" type="email" placeholder="tu@empresa.com" />
          </div>
          <div className="field">
            <label className="mono small dim">/ ¿qué buscas?</label>
            <div className="chips">
              <label className="chip-opt"><input type="radio" name="goal" defaultChecked/><span>Software a medida</span></label>
              <label className="chip-opt"><input type="radio" name="goal"/><span>Integración</span></label>
              <label className="chip-opt"><input type="radio" name="goal"/><span>Agente IA (AaaS)</span></label>
              <label className="chip-opt"><input type="radio" name="goal"/><span>Aún no lo tengo claro</span></label>
            </div>
          </div>
          <div className="field">
            <label className="mono small dim" htmlFor="f-msg">/ cuéntanos</label>
            <textarea id="f-msg" rows={4} placeholder="El proceso que más tiempo te roba…"></textarea>
          </div>
          <button type="submit" className="btn btn--pill btn--primary btn--lg">
            Enviar mensaje <span className="btn__arrow">→</span>
          </button>
          <span className="contacto__sent mono small">✓ mensaje enviado · te respondemos en &lt; 24h</span>
          <span className="contacto__disclaimer mono small dim">// tus datos no serán compartidos con terceros</span>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="container foot__inner">
        <div className="foot__big">
          <span className="foot__mark"><span></span></span>
          <span className="foot__word serif">satorus<em>.</em></span>
        </div>
        <div className="foot__cols">
          <div>
            <span className="mono small dim">// company</span>
            <a href="#">Manifiesto</a>
            <a href="#">Casos</a>
            <a href="#">Blog</a>
          </div>
          <div>
            <span className="mono small dim">// legal</span>
            <a href="/aviso-legal">Aviso legal</a>
            <a href="/politica-de-privacidad">Privacidad</a>
            <a href="#">Cookies</a>
          </div>
          <div>
            <span className="mono small dim">// social</span>
            <a href="#">LinkedIn ↗</a>
            <a href="#">GitHub ↗</a>
            <a href="#">X / Twitter ↗</a>
          </div>
          <div>
            <span className="mono small dim">// contacto</span>
            <a href="mailto:hola@satorus.es">hola@satorus.es</a>
            <a href="tel:+34900000000">+34 900 000 000</a>
            <span>Alicante · ES</span>
          </div>
        </div>
        <div className="foot__bar">
          <span className="mono small dim">© 2026 Satorus · Software &amp; IA para pymes</span>
          <span className="mono small dim">v3.0 · build 2026.05.28</span>
        </div>
      </div>
    </footer>
  )
}
