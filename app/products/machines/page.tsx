import { Section } from '@/components/ui'
import { categoryIntros } from '@/content/products'
import { pageMetadata } from '@/lib/site'
import { ProductGroup } from '../ProductGroup'

export const metadata = pageMetadata({
  title: 'Automation: silicone extrusion lines, mixers and ovens',
  description:
    'Our patented vertical silicone cable extrusion line, a horizontal line, a low-waste LSR mixer, a camera-guided autowinder, an energy-saving curing oven, a dip-coating machine, LCM equipment and tooling.',
  path: '/products/machines',
})

// Items in the site map still to be detailed. Each becomes a full product entry in
// content/products.ts (category 'equipment') once MoMixx supplies the content.
const toFollow = [
  { id: 'lcm', title: 'LCM', body: 'Equipment for our LCM process.' },
  { id: 'tool', title: 'Tool', body: 'Fabricated metal tools, including tools for the medical industry, made at our Batu Kawan, Penang factory.' },
]

export default function MachinesPage() {
  return (
    <ProductGroup
      category="equipment"
      eyebrow="Automation"
      title="Machines we *design and build*"
      intro={categoryIntros.equipment}
      cta={{ title: 'Machinery *enquiries*', body: 'Request a datasheet or a technical consultation with our team.' }}
      extra={
        <Section id="more" tone="muted" eyebrow="Also from our engineering team" title="LCM and *tooling*" className="scroll-mt-32">
          <ul data-reveal="stagger" className="grid gap-10 md:grid-cols-2">
            {toFollow.map((t) => (
              <li key={t.id} id={t.id} className="scroll-mt-32 border-t border-white/15 pt-6">
                <h3 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-[-0.03em]">
                  {t.title}
                  <span className="rounded-full border border-gold-400/45 bg-gold-100 px-2.5 py-0.5 text-xs font-medium tracking-normal text-gold-700">Details to follow</span>
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-zinc-400">{t.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      }
    />
  )
}
