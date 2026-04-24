import { Mail, Phone } from 'lucide-react'
import { useMemo, useState } from 'react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

type FormState = {
  name: string
  email: string
  phone: string
  message: string
  company: string // honeypot
}

function mailtoFallback(to: string, subject: string, body: string) {
  const href =
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  window.location.href = href
}

export function Cta() {
  const { content, settings } = useSite()
  const title = pick(content, 'cta.title')
  const desc = pick(content, 'cta.desc')
  const phone = pick(content, 'contact.phone')
  const email = pick(content, 'contact.email')
  const phoneLabel =
    content['cta.btnPhone']?.trim() || phone
  const emailLabel = pick(content, 'cta.btnEmail')

  const telHref = phone.replace(/\s/g, '')
  const variant = settings?.cta?.variant ?? 'buttons'

  const formLabels = useMemo(() => {
    const submitLabel =
      settings?.cta?.variant === 'form'
        ? settings.cta.form?.submitLabel?.trim()
        : ''
    const successMessage =
      settings?.cta?.variant === 'form'
        ? settings.cta.form?.successMessage?.trim()
        : ''
    return {
      submitLabel: submitLabel || 'Odeslat',
      successMessage:
        successMessage || 'Děkujeme, ozveme se vám co nejdříve.',
    }
  }, [settings])

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  return (
    <section className="px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-(--brand-primary) px-6 py-12 text-center shadow-xl sm:px-10 lg:px-16">
        <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/90">
          {desc}
        </p>

        {variant === 'form' ? (
          <div className="mx-auto mt-8 max-w-xl text-left">
            {sent ? (
              <div className="rounded-2xl bg-white/10 p-4 text-sm font-semibold text-white">
                {formLabels.successMessage}
              </div>
            ) : (
              <form
                className="grid gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSendError(null)

                  if (form.company.trim()) {
                    // honeypot filled → act as success
                    setSent(true)
                    return
                  }

                  const payload = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    message: form.message.trim(),
                    source: 'cta',
                  }

                  setSending(true)
                  try {
                    const res = await fetch('/api/v1/public/lead', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    })
                    if (res.ok) {
                      setSent(true)
                      return
                    }
                    throw new Error(`HTTP ${res.status}`)
                  } catch {
                    setSendError(
                      'Odeslání se nepovedlo. Otevřu e-mailový klient jako zálohu.'
                    )
                    mailtoFallback(
                      email,
                      'Poptávka z webu',
                      `Jméno: ${payload.name}\nE-mail: ${payload.email}\nTelefon: ${payload.phone}\n\nZpráva:\n${payload.message}`
                    )
                  } finally {
                    setSending(false)
                  }
                }}
              >
                <div className="hidden">
                  <label className="text-white">
                    Company
                    <input
                      value={form.company}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, company: e.target.value }))
                      }
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Jméno"
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none ring-2 ring-transparent transition placeholder:text-neutral-400 focus:ring-white/40"
                  />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="E-mail"
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none ring-2 ring-transparent transition placeholder:text-neutral-400 focus:ring-white/40"
                  />
                </div>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, phone: e.target.value }))
                  }
                  placeholder="Telefon (volitelné)"
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none ring-2 ring-transparent transition placeholder:text-neutral-400 focus:ring-white/40"
                />
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, message: e.target.value }))
                  }
                  placeholder="Zpráva (volitelné)"
                  className="w-full resize-none rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none ring-2 ring-transparent transition placeholder:text-neutral-400 focus:ring-white/40"
                />

                {sendError ? (
                  <p className="text-xs font-semibold text-white/90">
                    {sendError}
                  </p>
                ) : null}

                <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-(--brand-primary) shadow-md transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sending ? 'Odesílám…' : formLabels.submitLabel}
                  </button>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
                    <a
                      href={`tel:${telHref}`}
                      className="inline-flex items-center gap-2 hover:text-white"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {phoneLabel}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 hover:text-white"
                    >
                      <Mail className="h-4 w-4" aria-hidden />
                      {emailLabel}
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${telHref}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-(--brand-primary) shadow-md transition hover:bg-neutral-100"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {phoneLabel}
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {emailLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
