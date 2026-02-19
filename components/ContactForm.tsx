"use client"

import { useState } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { clsx } from "clsx"

type Status = "idle" | "submitting" | "success" | "error"

const solutionTypes = [
  "App Móvil Nativa",
  "Web App / ERP Gestión",
  "Automatización IA / RPA",
  "Digitalización de Proceso Local",
  "Consultoría Técnica",
]

const budgetRanges = [
  "Menos de 3.000€",
  "3.000€ – 8.000€",
  "8.000€ – 20.000€",
  "Más de 20.000€",
  "Prefiero no indicarlo",
]

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus("success")
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            ¡Solicitud enviada!
          </h3>
          <p className="text-slate-400">
            Recibirás nuestra propuesta técnica en menos de 48 horas.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-primary-400 hover:text-primary-300 underline transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Company */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder="Nombre de tu negocio"
          />
        </div>
      </div>

      {/* Solution type */}
      <div>
        <label
          htmlFor="solution"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Tipo de solución *
        </label>
        <select
          id="solution"
          name="solution"
          required
          className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none"
        >
          <option value="" className="bg-dark-800">
            Selecciona una opción
          </option>
          {solutionTypes.map((s) => (
            <option key={s} value={s} className="bg-dark-800">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Pain point */}
      <div>
        <label
          htmlFor="pain"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Punto de dolor principal *
        </label>
        <input
          type="text"
          id="pain"
          name="pain"
          required
          className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          placeholder='Ej: "Mis Excel fallan", "Quiero captar más clientes"'
        />
      </div>

      {/* Budget */}
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Presupuesto estimado
        </label>
        <select
          id="budget"
          name="budget"
          className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none"
        >
          <option value="" className="bg-dark-800">
            Selecciona un rango
          </option>
          {budgetRanges.map((b) => (
            <option key={b} value={b} className="bg-dark-800">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Cuéntanos qué proceso quieres simplificar hoy
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-4 py-3 bg-dark-700/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder="Describe brevemente tu situación actual y qué te gustaría mejorar..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className={clsx(
          "w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg",
          status === "submitting"
            ? "bg-primary-700 opacity-70 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-500 shadow-primary-600/30 hover:shadow-primary-500/40 hover:scale-[1.02]"
        )}
      >
        <Send size={18} />
        {status === "submitting"
          ? "Enviando solicitud..."
          : "Enviar y Recibir Propuesta en 48h"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Al enviar, aceptas nuestra política de privacidad. Tus datos nunca serán
        compartidos con terceros.
      </p>
    </form>
  )
}
