'use client'

import { Button, Field, Input, NativeSelect, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChakraScope } from '@/components/chakra/ChakraScope'

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

export function ContactForm({ formId, email, showVisits = false }: { formId: string; email: string; showVisits?: boolean }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const topicRef = useRef<HTMLSelectElement>(null)

  // Links such as /contact?topic=Recycling%20partnership arrive with that topic chosen.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('topic')
    const select = topicRef.current
    if (wanted && select && [...select.options].some((o) => o.value === wanted)) select.value = wanted
  }, [])

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

  // Once a field has a message, keep it current as the visitor types, and clear it when the field is fixed.
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const el = e.target as HTMLInputElement
    const name = el.name as Field
    if (!errors[name]) return
    const now = el.validity.valid ? undefined : el.validity.valueMissing ? messages[name].missing : (messages[name].invalid ?? messages[name].missing)
    if (now !== errors[name]) setErrors((prev) => ({ ...prev, [name]: now }))
  }

  // Fields with a message show it under the field; Chakra links the message to the input for screen readers.
  const field = (name: Field) => ({ invalid: Boolean(errors[name]) })
  const inputStyle = {
    size: 'lg',
    rounded: 'xl',
    bg: 'white',
    borderColor: 'gray.300',
    _hover: { borderColor: 'gray.400' },
    _invalid: { borderColor: 'border.error', focusRingColor: 'border.error' },
  } as const
  const errorText = (name: Field) => <Field.ErrorText>{errors[name]}</Field.ErrorText>

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
    <ChakraScope>
      <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className="card self-start p-6 sm:p-9">
        <Stack gap="6" colorPalette="brand">
          <Text fontSize="sm" color="fg.muted">
            Fields marked{' '}
            <Text as="span" color="brand.fg">
              *
            </Text>{' '}
            are required.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="6">
            <Field.Root required {...field('name')}>
              <Field.Label>
                Name <Field.RequiredIndicator color="brand.fg" />
              </Field.Label>
              <Input name="name" autoComplete="name" {...inputStyle} />
              {errorText('name')}
            </Field.Root>
            <Field.Root>
              <Field.Label>Company</Field.Label>
              <Input name="company" autoComplete="organization" {...inputStyle} />
            </Field.Root>
            <Field.Root required {...field('email')}>
              <Field.Label>
                Email <Field.RequiredIndicator color="brand.fg" />
              </Field.Label>
              <Input name="email" type="email" autoComplete="email" {...inputStyle} />
              {errorText('email')}
            </Field.Root>
            <Field.Root>
              <Field.Label>Contact number</Field.Label>
              <Input name="phone" type="tel" autoComplete="tel" {...inputStyle} />
            </Field.Root>
          </SimpleGrid>
          <Field.Root>
            <Field.Label>I’m interested in</Field.Label>
            <NativeSelect.Root size="lg">
              <NativeSelect.Field ref={topicRef} name="topic" defaultValue="Silicone materials" cursor="pointer" {...inputStyle}>
                <option>Silicone materials</option>
                <option>Recycled silicone</option>
                <option>Recycling partnership</option>
                {showVisits && <option>Factory visit</option>}
                <option>Cable machines</option>
                <option>Contract manufacturing</option>
                <option>Medical or precision parts</option>
                <option>Investor relations</option>
                <option>Something else</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root required {...field('message')}>
            <Field.Label>
              Message <Field.RequiredIndicator color="brand.fg" />
            </Field.Label>
            <Textarea name="message" rows={5} resize="vertical" {...inputStyle} />
            {errorText('message')}
          </Field.Root>
          {/* Spam trap: hidden from people, filled in by bots, and rejected by Formspree. */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div>
            <Button
              type="submit"
              size="lg"
              rounded="full"
              px="8"
              width={{ base: 'full', sm: 'auto' }}
              loading={status === 'sending'}
              loadingText="Sending…"
              boxShadow="inset 0 1px 0 rgb(255 255 255 / 0.22), 0 1px 2px rgb(15 69 40 / 0.25), 0 8px 18px -8px rgb(22 132 71 / 0.7)"
              _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
            >
              Send enquiry
            </Button>
          </div>
          <Stack aria-live="polite" gap="2" fontSize="xs" color="fg.muted">
            {status === 'error' && (
              <Text fontSize="sm" color="fg.error">
                Sorry, your enquiry could not be sent. Please try again, or email us at{' '}
                <a href={`mailto:${email}`} className="underline">
                  {email}
                </a>
                .
              </Text>
            )}
            <Text>
              We use your details only to reply to your enquiry. See our{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                privacy notice
              </Link>
              .
            </Text>
          </Stack>
        </Stack>
      </form>
    </ChakraScope>
  )
}
