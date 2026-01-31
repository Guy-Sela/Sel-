export interface Clock {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string; // feature page copy (keep in sync with main site)
  iframeUrl: string;
  mockups: string[];
}

export const clocks: Clock[] = [
  {
    slug: "semi-linear-clock",
    title: "Semi-linear Clock",
    subtitle: "Time as non-linear experience",
    description:
      'Always the right time, never in the same way. The next "moment" is selected randomly.',
    longDescription: `Always the right time, never in the same way. The next "moment" is selected randomly.`,
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
    description:
      "Possibly the most minimalistic clock ever made. Time is represented by a single circle, which, at intervals of twelve hours, either expands or contracts. At both extremes (12am, 12pm) it disappears altogether.",
    longDescription: `Possibly the most minimalistic clock ever made. Time is represented by a single circle, which, at intervals of twelve hours, either expands or contracts. At both extremes (12am, 12pm) it disappears altogether.`,
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
    description:
      "Our subjective grasp of time is very different from the rigid, conventional representation. In our minds we often wander between past, present and future, and so does this clock (it takes some time and close attention to see it).",
    longDescription: `Our subjective grasp of time is very different from the rigid, conventional representation. In our minds we often wander between past, present and future, and so does this clock (it takes some time and close attention to see it).`,
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
    description: "This one is self-explanatory.",
    longDescription: `This one is self-explanatory.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/abstract_hourglass/index.html",
    mockups: [
      "/mockups/abstract-hourglass/mockup_contemporaryclassical_v2.jpg",
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
    description:
      "The small triangle is time passed since the Big Bang. The large, open triangle is time left till the end of time. The scale is logarithmic—the next pixel will appear in 86 billion years.",
    longDescription: `The small triangle is time passed since the Big Bang. The large, open triangle is time left till the end of time. The scale is logarithmic—the next pixel will appear in 86 billion years.`,
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
    description:
      "This clock utters a special sound, up to three times every 24 hours, at random intervals, thus connecting moments in life that otherwise wouldn't have been connected.",
    longDescription: `This clock utters a special sound, up to three times every 24 hours, at random intervals, thus connecting moments in life that otherwise wouldn't have been connected.`,
    iframeUrl:
      "https://xn--sel-cla.com/meditativeclocks/clocks/serendipity/index.html",
    mockups: [
      "/mockups/serendipity-on-demand/train-station.png",
      "/mockups/serendipity-on-demand/mockup_mallfloor_v2.jpg",
      "/mockups/serendipity-on-demand/necklace_on_model_v21.jpg",
      "/mockups/serendipity-on-demand/necklace_variant2.jpg",
      "/mockups/serendipity-on-demand/mockup_tesla_v2.jpg",
    ],
  },
];

export function getClockBySlug(slug: string): Clock | undefined {
  return clocks.find((clock) => clock.slug === slug);
}
