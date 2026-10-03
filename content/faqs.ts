// Plain-English answers to common questions. These appear on /silicone, are
// marked up as FAQPage structured data, and are included in /llms.txt so that
// search and AI answer engines can quote them accurately.

import { recyclingCertificationNames } from './company'

export const siliconeFaqs = [
  {
    q: 'What is silicone?',
    a: 'Silicone is a man-made material whose backbone is a chain of silicon and oxygen atoms, with carbon and hydrogen attached. Its silicon is made from quartz sand. It can be made as a rubber, a liquid, a gel or a resin. People use it because it stays flexible in heat and cold, lasts a long time, keeps water out, and is suitable for many medical and food-contact uses.',
  },
  {
    q: 'Is silicone the same as silicon?',
    a: 'No. Silicon is a chemical element: a hard, grey material used to make computer chips and solar panels. Silicone is a flexible material made from silicon combined with oxygen, carbon and hydrogen. Momixx makes silicone.',
  },
  {
    q: 'What temperatures can silicone handle?',
    a: 'Most silicone rubber stays usable from about −40 °C to 150–200 °C, depending on the grade, and standard silicone cables are typically rated to about 180–200 °C. Special grades go further: in Momixx testing, MV silicone for electric-car cables kept working from −60 °C to 250 °C.',
  },
  {
    q: 'What is the difference between LSR and HCR?',
    a: 'They are the two main forms of silicone rubber. LSR (liquid silicone rubber) is a thick, paste-like liquid that is pumped and injected into moulds to make precise parts, such as medical parts and seals. HCR (high-consistency rubber) is a firm, dough-like solid. It is usually extruded (pushed through a shaped opening) to make things like cable jackets, or pressed into moulds. Momixx makes both.',
  },
  {
    q: 'Can silicone be recycled?',
    a: `Yes. Silicone can be recycled chemically: heat, usually with a catalyst, breaks it down into a liquid building block called DMC, which is cleaned and rebuilt into new silicone. This is still rare, and most silicone waste is landfilled or burned. Momixx’s recycled silicone is certified under ${recyclingCertificationNames}.`,
  },
  {
    q: 'Why is silicone used in medical devices?',
    a: 'Medical-grade silicone is chemically stable, well tolerated by the body, can be sterilised again and again, and is soft and flexible. That is why it is widely used in medical devices such as tubes, seals, valves and wearable monitors. Each finished device is still tested for safety in its own right, usually under ISO 10993.',
  },
  {
    q: 'What is flame-retardant (fire-retardant) silicone?',
    a: 'Ordinary silicone can burn. Flame-retardant silicone contains additives that form a protective layer in a flame, so the material stops burning once the flame is removed. Momixx flame-retardant grades are designed for the UL 94 flammability test for materials and for cables that pass the UL VW-1 flame test. Results depend on the grade, its thickness and the cable design.',
  },
  {
    q: 'What does PFAS-free silicone mean?',
    a: 'PFAS are “forever chemicals” that stay in the environment for a very long time. Some high-end rubbers used in watch straps and car parts, such as fluorinated rubber (FKM), are PFAS, and the EU is working towards a broad restriction. Standard silicone rubber contains no fluorine, so it is not a PFAS; fluorosilicones, a specialist type, are the exception. Momixx’s high-density silicone can replace FKM in many uses.',
  },
]
