import { ArticleCard } from '@/components/ArticleCard'
import { ArrowLink, PageHeader, Section } from '@/components/ui'
import { milestones } from '@/content/company'
import { news } from '@/content/news'
import { formatDate, getArticles } from '@/lib/articles'
import { pageMetadata, site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Newsroom',
  description: 'News, milestones and media contacts from MoMixx, the silicone materials, recycling and machinery company headquartered in Singapore.',
  path: '/newsroom',
})

export default function NewsroomPage() {
  const announcements = [...news].sort((a, b) => b.date.localeCompare(a.date))
  const recentMilestones = [...milestones].sort((a, b) => a.year - b.year).slice(-3).reverse()
  const latestArticles = getArticles().slice(0, 3)
  const mediaEmail = site.mediaEmail || site.email
  // Alternate section backgrounds whether or not Announcements is shown.
  const [milestonesTone, insightsTone, mediaTone] = announcements.length ? (['muted', 'white', 'muted'] as const) : (['white', 'muted', 'white'] as const)

  return (
    <>
      <PageHeader
        crumbs={[{ href: '/newsroom', label: 'Newsroom' }]}
        eyebrow="Newsroom"
        title="News from *MoMixx*"
        intro="Announcements, recent milestones and contacts for the media."
      />

      {announcements.length > 0 && (
        <Section id="announcements" eyebrow="Press releases" title="Announcements">
          <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {announcements.map((n) => (
              <li key={n.slug} id={n.slug} className="grid scroll-mt-28 gap-3 py-8 sm:grid-cols-[12rem_1fr] sm:gap-10">
                <time dateTime={n.date} className="text-sm text-zinc-400">
                  {formatDate(n.date)}
                </time>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">{n.title}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-zinc-300">{n.summary}</p>
                  {n.href && (
                    <a
                      href={n.href}
                      {...(/^https?:\/\//.test(n.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="mt-5 inline-block text-sm font-medium text-brand-300 hover:text-brand-200"
                    >
                      Read the release <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="milestones" tone={milestonesTone} eyebrow="Our journey" title="Recent *milestones*">
        <ol data-reveal="stagger" className="relative">
          {recentMilestones.map((m) => (
            <li key={m.year} className="grid items-start gap-3 border-t border-white/[0.08] py-8 sm:grid-cols-[12rem_1fr] sm:gap-10">
              <h3 className="display-md flex items-center gap-4 leading-none text-white">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-300" />
                {m.year}
              </h3>
              <ul className="space-y-2 text-lg text-zinc-300">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ArrowLink href="/about#milestones">All milestones since {site.foundingYear}</ArrowLink>
        </div>
      </Section>

      {latestArticles.length > 0 && (
        <Section id="insights" tone={insightsTone} eyebrow="Insights" title="Latest *insights*">
          <ul data-reveal="stagger" className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <li key={a.slug} className="flex">
                <ArticleCard article={a} showRender />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ArrowLink href="/insights">All insights</ArrowLink>
          </div>
        </Section>
      )}

      <Section id="media" tone={mediaTone} eyebrow="Media" title="Media *enquiries*">
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
          For interviews, information and images, email{' '}
          <a
            href={`mailto:${mediaEmail}?subject=${encodeURIComponent('Media enquiry')}`}
            className="font-medium break-words text-white underline decoration-white/20 underline-offset-4 hover:decoration-brand-300"
          >
            {mediaEmail}
          </a>
          .
        </p>
      </Section>
    </>
  )
}
