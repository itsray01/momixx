'use client'

import { useState } from 'react'

// No form backend yet: this opens the visitor's email app with the enquiry
// filled in. To receive submissions directly, point this at a form service or
// a Vercel route handler (see README → "Contact form").
export function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = `Website enquiry: ${f.get('topic')}`
    const body = [
      `Name: ${f.get('name')}`,
      `Company: ${f.get('company') || '-'}`,
      `Phone: ${f.get('phone') || '-'}`,
      `Email: ${f.get('email')}`,
      '',
      String(f.get('message') ?? ''),
    ].join('\n')
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const input =
    'mt-1.5 block w-full rounded-lg border border-white/15 bg-ink-900 px-3.5 py-2.5 text-white shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none'

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-200">
          Name
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          Company
          <input name="company" autoComplete="organization" className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          Contact number
          <input name="phone" type="tel" autoComplete="tel" className={input} />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-200">
        I’m interested in
        <select name="topic" className={input} defaultValue="Silicone materials">
          <option>Silicone materials</option>
          <option>Recycled silicone</option>
          <option>Extrusion equipment</option>
          <option>ODM / OEM manufacturing</option>
          <option>Medical or precision components</option>
          <option>Investor relations</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-200">
        Message
        <textarea name="message" required rows={5} className={input} />
      </label>
      <button type="submit" className="btn-primary w-full py-3 text-base sm:w-auto sm:px-8">
        Send enquiry
      </button>
      <p className="text-xs text-slate-500" aria-live="polite">
        {sent ? `Your email app should now be open with your message. If not, write to us at ${email}.` : 'Submitting opens your email app with your message ready to send.'}
      </p>
    </form>
  )
}
