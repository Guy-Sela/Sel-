export interface Clock {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  iframeUrl: string;
  mockups: string[];
}

export const clocks: Clock[] = [
  {
    slug: "semi-linear-clock",
    title: "Semi-linear Clock",
    subtitle: "Time as non-linear experience",
    description: "Past and future bleeding into the present moment.",
    longDescription: `The Semi-linear Clock challenges our assumption that time flows in one direction.

This piece visualizes temporal experience as a fluid continuum where past, present, and future coexist and influence each other. The pixelated aesthetic reflects the discrete nature of digital time while the flowing movements suggest something more organic beneath.

Ideal for corporate lobbies and meditation spaces where viewers benefit from a subtle disruption of their temporal assumptions.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/semi-linear_clock_svg/index.html",
    mockups: [
      "/mockups/slc/hotel_lobby.jpg",
      "/mockups/slc/business_lobby.jpg",
      "/mockups/slc/airport_installation.jpg",
      "/mockups/slc/train_station.jpg",
      "/mockups/slc/romantic_lounge_v3.jpg",
    ],
  },
  {
    slug: "ebb-and-flow",
    title: "The Ebb and Flow of Time",
    subtitle: "Temporal rhythm as tide",
    description: "Expansion and contraction of experienced duration.",
    longDescription: `Time doesn't move at a constant rate—it breathes. The Ebb and Flow of Time captures this fundamental truth of human temporal experience.

When we're engaged, hours pass in minutes. When we wait, seconds stretch into eternities. This piece makes visible the tidal nature of subjective time, creating a meditative focal point that acknowledges and honors our lived experience of duration.

Particularly suited for wellness centers and spa environments where the rhythm of the piece can synchronize with the viewer's breath.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/the_ebb_and_flow_of_time/index.html",
    mockups: [
      "/mockups/ebb&flow/mockup_boutique.jpg",
      "/mockups/ebb&flow/mockup_burningman_night.jpg",
      "/mockups/ebb&flow/mockup_train.jpg",
      "/mockups/ebb&flow/mockup_villa.jpg",
      "/mockups/ebb&flow/mockup_watchstore.jpg",
    ],
  },
  {
    slug: "present-past-future",
    title: "Present, Past and Future",
    subtitle: "Three temporal modes coexisting",
    description: "The eternal now containing all that was and will be.",
    longDescription: `Philosophy has long debated the reality of past and future. Do they exist, or is there only an eternal present moment?

This piece presents all three temporal modes simultaneously—not as a timeline, but as coexisting states that interpenetrate and define each other. The present is shown as the intersection point where memory and anticipation meet.

A contemplative work suited for spaces that invite reflection: hotel lobbies, waiting areas, or dedicated meditation rooms.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/present_past_and_future/index.html",
    mockups: [
      "/mockups/present-past and future/mockup_boutique.jpg",
      "/mockups/present-past and future/mockup_jet.jpg",
      "/mockups/present-past and future/mockup_observatory.jpg",
      "/mockups/present-past and future/mockup_spa.jpg",
      "/mockups/present-past and future/mockup_winery.jpg",
    ],
  },
  {
    slug: "abstract-hourglass",
    title: "Abstract Hourglass",
    subtitle: "Mortality abstracted",
    description: "Impermanence rendered in generative form.",
    longDescription: `The hourglass is humanity's oldest symbol of mortality—sand falling grain by grain, measuring out our allotted time.

This abstraction strips away the literal to reveal the emotional core: the continuous, irreversible flow from possibility to actuality to memory. Each moment that passes is gone forever, yet this very impermanence is what makes each moment precious.

A powerful piece for fine dining environments and high-end hospitality where the memento mori tradition meets contemporary digital expression.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/abstract_hourglass/index.html",
    mockups: [
      "/mockups/abstract-hourglass/mockup_chessclub.jpg",
      "/mockups/abstract-hourglass/mockup_concerthall.jpg",
      "/mockups/abstract-hourglass/mockup_contemporaryclassical.jpg",
      "/mockups/abstract-hourglass/mockup_gentlemansclub.jpg",
      "/mockups/abstract-hourglass/mockup_templeretreat.jpg",
    ],
  },
  {
    slug: "universe-clock",
    title: "Universe Clock",
    subtitle: "Cosmic vs. human time",
    description: "Our temporal scale against the infinite.",
    longDescription: `On a cosmic scale, human history is less than a blink. The Universe Clock juxtaposes our experience of time with the vast temporal scales of astronomy.

Light from distant stars began its journey before our species existed. The universe's 13.8 billion years dwarf our fleeting moments—yet those moments are all we have, and they are enough.

This piece works powerfully in corporate headquarters and luxury retail environments, offering a moment of cosmic perspective amid the rush of commerce.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/universe_clock/index.html",
    mockups: [
      "/mockups/universe-clock/city-view.jpg",
      "/mockups/universe-clock/mockup_bedroom(1).jpg",
      "/mockups/universe-clock/mockup_gallery.jpg",
      "/mockups/universe-clock/mockup_gallery_v2.jpg",
      "/mockups/universe-clock/mockup_yacht.jpg",
    ],
  },
  {
    slug: "serendipity-on-demand",
    title: "Serendipity on Demand",
    subtitle: "The moment of chance",
    description: "Randomness as temporal intervention.",
    longDescription: `We plan and schedule, but life's most meaningful moments often arrive unbidden. Serendipity on Demand is a paradox made visible—structured randomness, predictable unpredictability.

The piece introduces elements of chance into its temporal display, creating moments of surprise that mirror life's unexpected gifts. Each viewing is unique; each moment unrepeatable.

Ideal for creative spaces and boutique hotels where the unexpected is welcomed and the spontaneous celebrated.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/serendipity/index.html",
    mockups: [
      "/mockups/serendipity-on-demand/mockup_airport.jpg",
      "/mockups/serendipity-on-demand/mockup_mallfloor_v2.jpg",
      "/mockups/serendipity-on-demand/mockup_restaurant.jpg",
      "/mockups/serendipity-on-demand/mockup_spa_v2.jpg",
      "/mockups/serendipity-on-demand/mockup_tesla_v2.jpg",
    ],
  },
];

export function getClockBySlug(slug: string): Clock | undefined {
  return clocks.find((clock) => clock.slug === slug);
}
