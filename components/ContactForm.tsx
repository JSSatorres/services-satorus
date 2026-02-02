"use client"

import { useState } from "react"

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("success")
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold mb-2">¡Mensaje enviado!</h3>
        <p>Nos pondremos en contacto contigo muy pronto.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Empresa
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          placeholder="Nombre de tu negocio"
        />
      </div>

      <div>
        <label
          htmlFor="interest"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          ¿Qué te interesa?
        </label>
        <select
          id="interest"
          name="interest"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
        >
          <option value="erp">ERP a medida / Verifactu</option>
          <option value="web">Diseño Web Corporativo</option>
          <option value="app">App Hostelería / Pedidos</option>
          <option value="consultoria">Consultoría General</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Mensaje (Opcional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          placeholder="Cuéntanos un poco más sobre tu proyecto..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {status === "submitting" ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </form>
  )
}
