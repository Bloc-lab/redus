import { Clock, Lock, Mail, Phone, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'
import { getApiKey } from '../lib/env'

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
  const enabledRaw = (content['cta.enabled'] ?? '').trim().toLowerCase()
  const enabled = enabledRaw !== 'hide' && enabledRaw !== '0' && enabledRaw !== 'false' && enabledRaw !== 'off'
  if (!enabled) return null

  const title = pick(content, 'cta.title')
  const desc = pick(content, 'cta.desc')
  const phone = pick(content, 'contact.phone')
  const email = pick(content, 'contact.email')
  const phoneLabel =
    content['cta.btnPhone']?.trim() || phone
  const emailLabel = pick(content, 'cta.btnEmail')

  const telHref = phone.replace(/\s/g, '')
  const variant = settings?.cta?.variant ?? 'buttons'
  const formLayout =
    settings?.cta?.variant === 'form'
      ? settings.cta.form?.layout ?? 'center'
      : 'center'

  const introBadge = pick(content, 'cta.form.badge')
  const introTitle = pick(content, 'cta.form.title')
  const introLead = pick(content, 'cta.form.lead')
  const introBullets = [
    pick(content, 'cta.form.bullet1'),
    pick(content, 'cta.form.bullet2'),
    pick(content, 'cta.form.bullet3'),
  ].filter((s) => s.trim().length > 0)

  const nameLabel = pick(content, 'cta.form.nameLabel')
  const phoneFieldLabel = pick(content, 'cta.form.phoneLabel')
  const emailFieldLabel = pick(content, 'cta.form.emailLabel')
  const messageLabel = pick(content, 'cta.form.messageLabel')

  const formLabels = useMemo(() => {
    const submitLabelFromContent = pick(content, 'cta.form.submitLabel')
    const sendingLabelFromContent = pick(content, 'cta.form.sendingLabel')
    const successMessageFromContent = pick(content, 'cta.form.successMessage')

    const submitLabelFromSettings =
      settings?.cta?.variant === 'form'
        ? settings.cta.form?.submitLabel?.trim()
        : ''
    const successMessageFromSettings =
      settings?.cta?.variant === 'form'
        ? settings.cta.form?.successMessage?.trim()
        : ''
    return {
      submitLabel: submitLabelFromContent || submitLabelFromSettings || 'Odeslat',
      sendingLabel: sendingLabelFromContent || 'Odesílám…',
      successMessage:
        successMessageFromContent ||
        successMessageFromSettings ||
        'Děkujeme, ozveme se vám co nejdříve.',
    }
  }, [content, settings])

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

  const formEl = (
    <>
      {sent ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-900 shadow-sm">
          {formLabels.successMessage}
        </div>
      ) : (
        <form
          className="grid gap-6"
          onSubmit={async (e) => {
            e.preventDefault()
            setSendError(null)

            if (form.company.trim()) {
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
              const apiKey = getApiKey()
              const res = await fetch('/api/v1/public/lead', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
                },
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
            <label>
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

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                {nameLabel}
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                className="h-12 w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition focus:border-(--brand-primary) focus:ring-1 focus:ring-(--brand-primary)"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                {phoneFieldLabel}
              </label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
                className="h-12 w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition focus:border-(--brand-primary) focus:ring-1 focus:ring-(--brand-primary)"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
              {emailFieldLabel}
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              className="h-12 w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition focus:border-(--brand-primary) focus:ring-1 focus:ring-(--brand-primary)"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
              {messageLabel}
            </label>
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) =>
                setForm((s) => ({ ...s, message: e.target.value }))
              }
              className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-(--brand-primary) focus:ring-1 focus:ring-(--brand-primary)"
            />
          </div>

          {sendError ? (
            <p className="text-sm font-medium text-neutral-700">
              {sendError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={sending}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-(--brand-primary) px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sending ? formLabels.sendingLabel : formLabels.submitLabel}
          </button>
        </form>
      )}
    </>
  )

  return (
    <section
      id="kontakt"
      className="scroll-mt-24 border-t border-neutral-200 bg-white px-6 py-20 lg:py-32"
    >
      {variant === 'form' ? (
        <div className={`mx-auto ${formLayout === 'split' ? 'max-w-[1280px]' : 'max-w-[800px]'}`}>
          {formLayout === 'split' ? (
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
              <div className="pt-2 lg:col-span-4">
                <p className="inline-flex items-center rounded-full border border-neutral-200 bg-(--brand-secondary-1) px-3 py-1 text-xs font-semibold text-(--brand-secondary-2)">
                  {introBadge}
                </p>
                <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                  {introTitle}
                </h2>
                <p className="mt-4 max-w-xl text-pretty leading-relaxed text-neutral-600">
                  {introLead}
                </p>

                {introBullets.length ? (
                  <ul className="mt-10 space-y-4 text-sm text-neutral-700">
                    {introBullets.slice(0, 3).map((line, i) => {
                      const Icon = i === 0 ? Clock : i === 1 ? Lock : ShieldCheck
                      return (
                        <li key={line} className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-secondary-1) text-(--brand-secondary-2)">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span>{line}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm sm:p-10 lg:col-span-8">
                {formEl}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-neutral-600">
                {desc}
              </p>
              <div className="mx-auto mt-12 max-w-[520px] text-left">
                {formEl}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-neutral-600">
            {desc}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${telHref}`}
              className="inline-flex items-center gap-2 rounded-lg bg-(--brand-primary) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover)"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {phoneLabel}
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-transparent px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-white"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {emailLabel}
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
