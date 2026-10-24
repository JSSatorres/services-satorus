# Footer year and WhatsApp contact Implementation Plan

**Goal:** Keep the footer copyright year current and make the displayed Satorus number open a WhatsApp conversation that can later be handled by the existing agent.

**Architecture:** A small client component updates the server-rendered year after hydration and while the page remains open. The footer links to WhatsApp using the public business number already held in `lib/site.ts`. Automated replies use the separate `D:/Proyectos/agente-chat/agente-whatsapp-saas` webhook after the real Meta number, credentials, approved knowledge and HTTPS endpoint are configured.

**Tech Stack:** Next.js 16, React 19, TypeScript, WhatsApp Business Platform Cloud API.

## Perfil de verificación

- Nivel: standard
- Motivo: visible React behavior and an external contact link; the separate webhook is configuration dependent.
- Comandos: `npm run lint`; `npm run build`; inspect the rendered footer link and year.
- Evidencias esperadas: the footer uses the current browser year, its number opens `wa.me/34614431897`, and the build passes.

## Incidencias de verificación

### Compilación local

- 2026-10-24: `npm run build` quedó detenido en la fase de compilación mientras el servidor de desarrollo existente usaba `.next`. Se canceló ese intento.
- `npm run build -- --webpack` devolvió `EPERM` al crear rutas cambiantes dentro de `.next`; se verificó que crear esas carpetas manualmente sí está permitido. No se detuvo el servidor de desarrollo existente.
- `npm run lint` terminó con 0 errores y un aviso previo en `media/instagram/publicaciones/_compartido/story.js`. `npx tsc --noEmit` terminó sin errores. `git diff --check` terminó sin errores.

### Activación del asistente

- El piloto `D:/Proyectos/agente-chat/agente-whatsapp-saas` ya implementa webhook firmado, selección de empresa por `phone_number_id`, entrada idempotente, respuesta de IA y envío de texto por Cloud API.
- Su `tenants.example.json` contiene identificadores ficticios y faltan `tenants.json` y `.env` reales. Para activar respuestas automáticas en `614 43 18 97` faltan el alta del número en Meta, Phone Number ID, token, secreto de app, token de verificación, conocimiento aprobado y despliegue HTTPS del webhook. Un enlace `wa.me` no activa por sí mismo el bot.

---

### Task 1: Keep the copyright year current

**Files:** Create `components/footer-year.tsx`; modify `components/site-footer.tsx`.

1. Add a small client component that receives the server year and refreshes it from `Date#getFullYear()` after mount.
2. Recheck the year periodically while the page is open and when the tab becomes visible.
3. Replace the inline footer year expression with the component.
4. Verify lint and build.

### Task 2: Link the displayed number to WhatsApp

**Files:** Modify `lib/site.ts`, `components/site-footer.tsx`, `components/company-chat.tsx`.

1. Derive the WhatsApp destination from the existing E.164 business number and prefill a short greeting.
2. Label the footer link as WhatsApp and make it accessible to screen readers.
3. Keep the optional floating button pointed at that same number when its readiness setting is enabled.
4. Verify the href and responsive footer layout.

### Task 3 (final): Update documentation

**Files:** Update this plan with verification results and the remaining requirements for activating the webhook.

1. Record that the current WhatsApp pilot has placeholder tenant identifiers and no local credentials, so automated replies require Meta provisioning and deployment.
2. Record actual verification commands and results.
