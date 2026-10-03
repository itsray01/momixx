// Silicone glossary shown at /insights/glossary and marked up as a
// DefinedTermSet, so search and AI answer engines can quote the definitions.
// Keep each definition to one or two plain-English sentences.

export type Term = { term: string; also?: string; definition: string; link?: string }

/** The anchor for a term on the glossary page, e.g. /insights/glossary#mass-balance. */
export const glossaryId = (term: string) => term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const glossary: Term[] = [
  { term: 'Chain of custody', definition: 'A documented record of who held a material at every step, used by certification schemes to prove that recycled content in a finished product is genuine.', link: '/sustainability' },
  { term: 'Compound', definition: 'A ready-to-use silicone blend: base polymer plus fillers, pigments and additives tuned for a job such as fire retardancy, colour or strength.', link: '/products' },
  { term: 'Concentricity', definition: 'How evenly a cable’s conductor is centred inside its jacket, expressed as a percentage. Higher is better; uneven jackets have thin spots.', link: '/products/vertical-extruder' },
  { term: 'Crosshead', definition: 'The die assembly on an extruder that applies material around a wire travelling through it, forming a cable jacket.', link: '/products/horizontal-extruder' },
  { term: 'Curing', definition: 'The step that turns soft, uncured silicone into a permanent, elastic rubber, usually with heat. Also called vulcanisation.' },
  { term: 'Depolymerisation', definition: 'Breaking a polymer’s long chains back into small molecules. In silicone recycling it turns scrap silicone into cyclic siloxanes such as DMC.', link: '/recycled-silicone' },
  { term: 'DMC', also: 'Dimethylcyclosiloxane', definition: 'A mixture of small ring-shaped silicone molecules. It is a key building block for making new silicone, and it can be recovered from silicone scrap by chemical recycling.', link: '/recycled-silicone' },
  { term: 'dE94', also: 'ΔE94, Delta E 1994', definition: 'A standard measure of how different two colours look. A dE94 (ΔE94) below about 1 is generally too small for most people to see.', link: '/products/odm-oem' },
  { term: 'Extrusion', definition: 'Pushing a soft material through a shaped opening (a die) to make a continuous profile, such as a cable jacket or tube.', link: '/insights/how-silicone-cable-is-made' },
  { term: 'Flame-retardant', also: 'Fire-retardant', definition: 'Describes a material made to resist catching fire and to stop burning once the flame is removed. It does not mean the material cannot burn.', link: '/insights/fire-retardant-silicone-usb-c-cables' },
  { term: 'FKM', also: 'Fluoroelastomer', definition: 'A fluorine-based synthetic rubber used in seals and watch straps, valued for its resistance to heat, fuels and oils. As a fluoropolymer it falls within the PFAS group of chemicals.', link: '/products/momixx-high-density' },
  { term: 'Fluorosilicone', also: 'FVMQ', definition: 'A specialist silicone rubber that contains fluorine for better fuel and oil resistance. Unlike standard silicone, it falls within the PFAS group.', link: '/insights/pfas-free-silicone' },
  { term: 'GRS', also: 'Global Recycled Standard', definition: 'An international certification owned by Textile Exchange that verifies recycled content and chain of custody, and sets social, environmental and chemical requirements.', link: '/sustainability' },
  { term: 'HCR', also: 'High-consistency rubber', definition: 'A thick, dough-like solid silicone rubber, usually shaped by extrusion or compression moulding. Common in cable jackets, tubing and profiles.', link: '/insights/lsr-vs-hcr' },
  { term: 'IP68', definition: 'An ingress-protection rating for a finished product, meaning it is dust-tight and protected against continuous immersion in water under conditions set by the manufacturer. It rates the whole device, not a material.', link: '/products/momixx-seal' },
  { term: 'ISCC PLUS', definition: 'An international certification that traces circular, recycled and bio-based raw materials through supply chains, including by the mass-balance method.', link: '/sustainability' },
  { term: 'ISO 13485', definition: 'The international quality-management standard for organisations that design or manufacture medical devices and their components. It certifies how a company works, not a material or product.', link: '/applications/medical' },
  { term: 'LSR', also: 'Liquid silicone rubber', definition: 'A pourable, two-part silicone that is mixed and injection-moulded or extruded in closed, automated systems, giving precise, consistent parts.', link: '/insights/lsr-vs-hcr' },
  { term: 'Mass balance', definition: 'A chain-of-custody method that tracks the amount of certified material entering a process and allocates it to outputs, even when certified and conventional inputs are mixed. A given product may not physically contain the share it claims.', link: '/insights/grs-vs-iscc-plus-vs-scs' },
  { term: 'PCR', also: 'Post-consumer recycled', definition: 'Material recovered from products that consumers have used and thrown away.', link: '/products/recycled-silicone' },
  { term: 'PFAS', also: 'Per- and polyfluoroalkyl substances', definition: 'A large family of fluorine-containing chemicals, sometimes called “forever chemicals” because they persist in the environment. The EU is working towards a broad restriction.', link: '/insights/pfas-free-silicone' },
  { term: 'PIR', also: 'Post-industrial recycled', definition: 'Material recovered from factory offcuts and rejects before it reaches a consumer.', link: '/products/recycled-silicone' },
  { term: 'Shore A', definition: 'A scale for the hardness of soft materials such as rubber. Lower numbers are softer and more flexible.', link: '/products/momixx-move' },
  { term: 'Silicon', definition: 'A chemical element (symbol Si, atomic number 14). Hard, grey and brittle, it is used to make computer chips and solar cells, and is the starting point for silicone.', link: '/silicone' },
  { term: 'Silicone', definition: 'A man-made polymer with a backbone of alternating silicon and oxygen atoms. It can be a rubber, liquid, gel or resin, and is valued for heat resistance, flexibility and durability.', link: '/silicone' },
  { term: 'Siloxane', definition: 'The silicon–oxygen–silicon bond that forms the backbone of silicone, and the general name for compounds built on it.', link: '/silicone' },
  { term: 'Thermal interface material', also: 'TIM', definition: 'A soft pad, gel or paste that fills the tiny air gaps between a chip and its cooler so heat flows away. Many are made from silicone.', link: '/insights/silicone-in-ai-data-centres' },
  { term: 'TPE', also: 'Thermoplastic elastomer', definition: 'A rubber-like plastic that softens when heated. Widely used for cable jackets; it is cheaper than silicone but less heat-resistant.', link: '/products/momixx-mm' },
  { term: 'UL 94', definition: 'A flammability test standard for plastic and rubber materials. Ratings such as V-0 describe how quickly a vertical sample of a given thickness stops burning and whether it drips flaming particles.', link: '/insights/fire-retardant-silicone-usb-c-cables' },
  { term: 'VW-1', definition: 'A vertical-wire flame test for finished cables, defined in UL 2556. A cable passes if it stops burning within 60 seconds of each flame application, limits flame spread and does not ignite cotton below it with burning drips.', link: '/products/momixx-mm' },
  { term: 'XLPO', also: 'Cross-linked polyolefin', definition: 'A heat-resistant plastic commonly used for automotive and EV cable insulation.', link: '/products/momixx-move' },
]
