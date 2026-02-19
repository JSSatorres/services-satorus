import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const isPlaceholder = apiKey === "re_your_api_key_here"
    
    if (!apiKey || isPlaceholder) {
      console.error("❌ Resend API Key is missing or invalid. Please set it in .env")
      return NextResponse.json(
        { success: false, error: "Servicio de contacto no configurado todavía." },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    const data = await req.json()
    const { name, company, solution, pain, budget, message } = data

    console.log("📨 Intentando enviar email para:", name)

    // Real email sending with Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Satorus Web <onboarding@resend.dev>",
      to: ["juansataz.dev@gmail.com"], // Sending only to verified email for Sandbox mode
      replyTo: "info@satorus.es",

      subject: `🚀 Nueva solicitud: ${solution} de ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #3b82f6;">Nueva solicitud de proyecto</h1>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Empresa:</strong> ${company || "No indicada"}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Tipo de Solución:</strong> ${solution}</p>
          <p><strong>Problema a resolver:</strong> ${pain}</p>
          <p><strong>Presupuesto estimado:</strong> ${budget || "No indicado"}</p>
          <p style="white-space: pre-wrap;"><strong>Mensaje adicional:</strong><br/>${message}</p>
        </div>
      `,
    })

    if (resendError) {
      console.error("❌ Error de Resend:", resendError)
      return NextResponse.json(
        { success: false, error: resendError.message },
        { status: 500 }
      )
    }

    console.log("✅ Email enviado con éxito. ID:", resendData?.id)
    return NextResponse.json({ success: true, message: "Enviado correctamente", id: resendData?.id })

  } catch (error) {
    console.error("Error sending real contact email:", error)
    return NextResponse.json(
      { success: false, error: "Error al enviar el correo" },
      { status: 500 }
    )
  }
}
