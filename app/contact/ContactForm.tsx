'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

// Enquiries are delivered by Formspree (formspree.io) to the company inbox.
// The form's ID is set in lib/site.ts → formspreeId.

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Field = 'name' | 'email' | 'message'

// Shown under a field the visitor needs to fix, instead of the browser's own pop-up.
const messages: Record<Field, { missing: string; invalid?: string }> = {
  name: { missing: 'Please enter your name.' },
  email: { missing: 'Please enter your email address.', invalid: 'Please check your email address.' },
  message: { missing: 'Please tell us a little about your enquiry.' },
}

export function ContactForm({ formId, email }: { formId: string; email: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)

  function check(form: HTMLFormElement) {
    const found: Partial<Record<Field, string>> = {}
    for (const name of Object.keys(messages) as Field[]) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
      if (!el || el.validity.valid) continue
      found[name] = el.validity.valueMissing ? messages[name].missing : (messages[name].invalid ?? messages[name].missing)
    }
    return found
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const found = check(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      ;(form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    const f = new FormData(form)
    // The topic leads the email subject, so the inbox can be filtered by it.
    f.set('_subject', `Website enquiry: ${f.get('topic')}`)

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, { method: 'POST', body: f, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  // Clear a field's message as soon as it is fixed.
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const el = e.target as HTMLInputElement
    const name = el.name as Field
    if (errors[name] && el.validity.valid) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const input = (bad?: string) =>
    `mt-2 block w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-zinc-500 transition-[border-color,box-shadow,background-color] duration-200 hover:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-4 ${
      bad ? 'border-red-400/70 focus:border-red-300 focus:ring-red-400/15' : 'border-white/12 focus:border-white/50 focus:ring-white/[0.07]'
    }`
  const label = 'block text-sm font-medium text-zinc-200'
  const required = (
    <span className="text-brand-300" aria-hidden="true">
      {' '}
      *
    </span>
  )
  const error = (name: Field) =>
    errors[name] ? (
      <span id={`${name}-error`} className="mt-2 block text-sm font-normal text-red-300 motion-safe:animate-[fade-in_0.25s_ease]">
        {errors[name]}
      </span>
    ) : null
  const described = (name: Field) => (errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {})

  if (status === 'sent') {
    return (
      <div className="card self-start p-8 sm:p-10 motion-safe:animate-[fade-in_0.6s_cubic-bezier(0.22,1,0.36,1)]" role="status">
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white">
          <svg viewBox="0 0 24 24" className="size-6">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
          </svg>
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">Thank you, your enquiry has been sent</h2>
        <p className="mt-3 leading-relaxed text-zinc-300">The right person on our team will reply to you by email.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-ghost-dark mt-8">
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className="card space-y-6 self-start p-6 sm:p-9">
      <p className="text-sm text-zinc-400">
        Fields marked <span className="text-brand-300">*</span> are required.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Name{required}
          <input name="name" required autoComplete="name" className={input(errors.name)} {...described('name')} />
          {error('name')}
        </label>
        <label className={label}>
          Company
          <input name="company" autoComplete="organization" className={input()} />
        </label>
        <label className={label}>
          Email{required}
          <input name="email" type="email" required autoComplete="email" className={input(errors.email)} {...described('email')} />
          {error('email')}
        </label>
        <label className={label}>
          Contact number
          <input name="phone" type="tel" autoComplete="tel" className={input()} />
        </label>
      </div>
      <label className={label}>
        I’m interested in
        <span className="relative mt-2 block">
          <select name="topic" className={`${input()} mt-0 cursor-pointer appearance-none pr-11`} defaultValue="Silicone materials">
            <option>Silicone materials</option>
            <option>Recycled silicone</option>
            <option>Cable machines</option>
            <option>Contract manufacturing</option>
            <option>Medical or precision parts</option>
            <option>Investor relations</option>
            <option>Something else</option>
          </select>
          <svg viewBox="0 0 12 12" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-zinc-400">
            <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </label>
      <label className={label}>
        Message{required}
        <textarea name="message" required rows={5} className={`${input(errors.message)} resize-y`} {...described('message')} />
        {error('message')}
      </label>
      {/* Spam trap: hidden from people, filled in by bots, and rejected by Formspree. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3 text-base disabled:opacity-70 sm:w-auto sm:px-8">
        {status === 'sending' && (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 animate-spin">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
            <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
      <div aria-live="polite" className="space-y-2 text-xs text-zinc-400">
        {status === 'error' && (
          <p className="text-sm text-red-300">
            Sorry, your enquiry could not be sent. Please try again, or email us at{' '}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
            .
          </p>
        )}
        <p>
          We use your details only to reply to your enquiry. See our{' '}
          <Link href="/privacy" className="underline decoration-white/20 underline-offset-2 hover:text-white">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
