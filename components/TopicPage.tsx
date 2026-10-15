import Link from 'next/link'
import { ArrowLink, CtaBand, PageHeader, Section } from '@/components/ui'
import { getProduct, productHref, products } from '@/content/products'
import { getTopic, type TopicSection } from '@/content/topics'
import { pageMetadata } from '@/lib/site'

export function topicMetadata(path: string) {
  const t = getTopic(path)
  return pageMetadata({ title: t.seoTitle, description: t.description, path: t.path })
}

/** Grade rows from the product catalogue, by model code. */
function gradeRows(codes: string[]) {
  return codes.flatMap((code) => {
    for (const p of products) {
      const m = p.models?.find((x) => x.model === code)
      if (m) return [{ ...m, product: p.name, href: productHref(p.slug) }]
    }
    return []
  })
}

function HoldingTag() {
  return <span className="ml-3 inline-flex translate-y-[-0.2em] items-center rounded-full border border-gold-400/45 bg-gold-100 px-2.5 py-0.5 align-middle text-xs font-medium tracking-normal text-gold-700">Details to follow</span>
}

function TopicBlock({ s, index }: { s: TopicSection; index: number }) {
  const rows = s.grades ? gradeRows(s.grades) : []
  const linked = (s.products ?? []).map(getProduct).filter((p) => p !== undefined)
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="grid scroll-mt-32 gap-6 border-t border-white/10 py-12 first:border-t-0 first:pt-0 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
      <p aria-hidden="true" className="font-display text-sm font-medium text-gold-600 tabular-nums md:pt-2">{String(index + 1).padStart(2, '0')}</p>
      <div className="min-w-0">
        <h2 id={`${s.id}-title`} className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          {s.title}
          {s.holding && <HoldingTag />}
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-lg leading-relaxed text-zinc-300">
          {s.body.map((b) => (
            <p key={b}>{b}</p>
          ))}
        </div>
        {s.points && (
          <ul className="mt-6 max-w-2xl space-y-3 text-zinc-300">
            {s.points.map((pt) => (
              <li key={pt} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {pt}
              </li>
            ))}
          </ul>
        )}
        {rows.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">{s.title}: grades</caption>
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs text-zinc-400">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Grade</th>
                  <th scope="col" className="px-5 py-3 font-medium">Form</th>
                  <th scope="col" className="px-5 py-3 font-medium">Property</th>
                  <th scope="col" className="px-5 py-3 font-medium">Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((r) => (
                  <tr key={r.model}>
                    <th scope="row" className="px-5 py-3 font-semibold text-white tabular-nums">{r.model}</th>
                    <td className="px-5 py-3 text-zinc-300">{r.type}</td>
                    <td className="px-5 py-3 text-zinc-300">{r.properties}</td>
                    <td className="px-5 py-3">
                      <Link href={r.href} className="text-brand-300 hover:text-brand-200">
                        {r.product}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {linked.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {linked.map((p) => (
              <li key={p.slug}>
                <Link href={productHref(p.slug)} className="card lift group flex h-full flex-col p-5">
                  <span className="font-semibold tracking-[-0.02em] text-white">{p.name}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-zinc-400">{p.tagline}</span>
                  <span className="mt-auto pt-3 text-sm font-medium text-brand-300 group-hover:text-brand-200">
                    View <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {s.links && (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {s.links.map((l) => (
              <ArrowLink key={l.href} href={l.href}>
                {l.label}
              </ArrowLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * A site-map page: a header, an "On this page" index and one numbered block per
 * item in the site map. Content lives in content/topics.ts.
 */
export function TopicPage({ path }: { path: string }) {
  const t = getTopic(path)
  return (
    <>
      <PageHeader
        crumbs={[t.parent, { href: t.path, label: t.label }]}
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.intro}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-sm font-medium text-gold-600">On this page</p>
              <ol className="mt-4 space-y-2.5 border-l border-white/10 text-sm">
                {t.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-zinc-400 transition-colors hover:border-gold-500 hover:text-white">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div data-reveal>
            {t.sections.map((s, i) => (
              <TopicBlock key={s.id} s={s} index={i} />
            ))}
            {t.related && (
              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-10">
                <p className="text-sm font-medium text-zinc-500">Related</p>
                {t.related.map((l) => (
                  <ArrowLink key={l.href} href={l.href}>
                    {l.label}
                  </ArrowLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
      <CtaBand {...(t.cta ?? { body: 'Tell us about your application and our team will recommend a material or develop one.' })} />
    </>
  )
}
