'use client'

import Link from 'next/link'
import { useState } from 'react'

// Enquiries are delivered by Formspree (formspree.io) to the company inbox.
// The form's ID is set in lib/site.ts → formspreeId.

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm({ formId, email }: { formId: string; email: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
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

  const input =
    'mt-1.5 block w-full rounded-lg border border-white/15 bg-ink-900 px-3.5 py-2.5 text-white shadow-sm placeholder:text-zinc-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none'
  const required = (
    <span className="text-brand-300" aria-hidden="true">
      {' '}
      *
    </span>
  )

  if (status === 'sent') {
    return (
      <div className="card p-6 sm:p-8" role="status">
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">Thank you, your enquiry has been sent</h2>
        <p className="mt-3 leading-relaxed text-zinc-300">The right person on our team will reply to you by email.</p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-ghost-dark mt-6">
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
      <p className="text-xs text-zinc-400">
        Fields marked <span className="text-brand-300">*</span> are required.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-200">
          Name{required}
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="block text-sm font-medium text-zinc-200">
          Company
          <input name="company" autoComplete="organization" className={input} />
        </label>
        <label className="block text-sm font-medium text-zinc-200">
          Email{required}
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block text-sm font-medium text-zinc-200">
          Contact number
          <input name="phone" type="tel" autoComplete="tel" className={input} />
        </label>
      </div>
      <label className="block text-sm font-medium text-zinc-200">
        I’m interested in
        <select name="topic" className={input} defaultValue="Silicone materials">
          <option>Silicone materials</option>
          <option>Recycled silicone</option>
          <option>Cable machines</option>
          <option>Contract manufacturing</option>
          <option>Medical or precision parts</option>
          <option>Investor relations</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-zinc-200">
        Message{required}
        <textarea name="message" required rows={5} className={input} />
      </label>
      {/* Spam trap: hidden from people, filled in by bots, and rejected by Formspree. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3 text-base disabled:opacity-60 sm:w-auto sm:px-8">
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
