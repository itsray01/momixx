// AI-generated product illustrations (made in ChatGPT from Ray's photos or written prompts).
// They are not photographs of MoMixx products. Each carries a short caption naming what it shows.
// Rules they follow: no people, factories, logos, text or look-alikes of a real brand's product.

export type Picture = { src: string; alt: string; width: number; height: number; caption: string }

const dir = '/images/products/illustrations'
const wide = { width: 1536, height: 1024 }

export const illustrations = {
  usbCables: {
    src: `${dir}/usb-c-cables.webp`,
    alt: 'Three coiled USB-C cables with soft silicone jackets, in red, white and navy',
    ...wide,
    caption: 'USB-C cables with silicone jackets',
  },
  watchStraps: {
    src: `${dir}/watch-straps.webp`,
    alt: 'Silicone smartwatch straps in red, white and navy',
    ...wide,
    caption: 'Smartwatch straps in silicone',
  },
  evCable: {
    src: `${dir}/ev-cable.webp`,
    alt: 'A thick yellow high-voltage cable, looped, with its copper core showing at the cut end',
    ...wide,
    caption: 'High-voltage EV cable',
  },
  phoneCases: {
    src: `${dir}/phone-cases.webp`,
    alt: 'Three plain silicone phone cases in cream, sage green and sky blue, lying side by side',
    ...wide,
    caption: 'Silicone phone cases',
  },
  seals: {
    src: `${dir}/seals.webp`,
    alt: 'A rectangular device gasket, O-rings and a connector seal in translucent white, red and navy silicone',
    ...wide,
    caption: 'Gaskets and seals',
  },
  compoundSheets: {
    src: `${dir}/compound-sheets.webp`,
    alt: 'A stack of red, white and navy silicone rubber sheets, the top sheet curling up at one corner',
    ...wide,
    caption: 'Solid silicone compound',
  },
  pctg: {
    src: `${dir}/pctg-bottle-jar.webp`,
    alt: 'A crystal-clear plastic bottle and a small clear cosmetic jar',
    ...wide,
    caption: 'Clear bottle and jar',
  },
  yarnLeather: {
    src: `${dir}/yarn-leather.webp`,
    alt: 'Three spools of yarn beside a fan of folded silicone leather swatches in several colours',
    ...wide,
    caption: 'Silicone yarn and leather',
  },
  thermalPads: {
    src: `${dir}/thermal-pads.webp`,
    alt: 'A stack of grey silicone thermal pads, one half peeled from its clear protective film',
    ...wide,
    caption: 'Silicone thermal pads',
  },
  magneticCoil: {
    src: `${dir}/magnetic-coil.webp`,
    alt: 'A navy silicone cable coiled neatly, with no clips or ties',
    ...wide,
    caption: 'A cable that coils and holds',
  },
  conductiveParts: {
    src: `${dir}/conductive-parts.webp`,
    alt: 'A black silicone keypad with round buttons, a thin gasket and a charging-port plug',
    ...wide,
    caption: 'Conductive silicone parts',
  },
  coatedCable: {
    src: `${dir}/coated-cable.webp`,
    alt: 'Close-up of a white silicone-coated cable curving across the frame',
    ...wide,
    caption: 'A soft-touch coated cable',
  },
  foodGrade: {
    src: `${dir}/food-grade.webp`,
    alt: 'A red silicone spatula, a white seal ring and a navy silicone lid',
    ...wide,
    caption: 'Food-grade silicone products',
  },
  medicalTubing: {
    src: `${dir}/medical-tubing.webp`,
    alt: 'A coil of clear silicone tubing with two small clear valves and a clear seal',
    ...wide,
    caption: 'Clear silicone tubing and valves',
  },
  offcuts: {
    src: `${dir}/offcuts.webp`,
    alt: 'A heap of mixed-colour silicone offcuts and trimmings',
    width: 870,
    height: 720,
    caption: 'Silicone offcuts',
  },
} satisfies Record<string, Picture>
