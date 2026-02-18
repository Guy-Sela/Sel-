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
    iframeUrl: "/meditativeclocks/clocks/semi-linear_clock_svg/",
    mockups: [
      "/mockups-compressed/slc/hotel_lobby.webp",
      "/mockups-compressed/slc/business_lobby.webp",
      "/mockups-compressed/slc/airport_installation.webp",
      "/mockups-compressed/slc/train_station.webp",
      "/mockups-compressed/slc/romantic_lounge_v3.webp",
    ],
  },
  {
    slug: "ebb-and-flow",
    title: "The Ebb and Flow of Time",
    subtitle: "Temporal rhythm as tide",
    description:
      "Possibly the most minimalistic clock ever made. Time is represented by a single circle, which, at intervals of twelve hours, either expands or contracts. At both extremes (12am, 12pm) it disappears altogether.",
    longDescription: `Possibly the most minimalistic clock ever made. Time is represented by a single circle, which, at intervals of twelve hours, either expands or contracts. At both extremes (12am, 12pm) it disappears altogether.`,
    iframeUrl: "/meditativeclocks/clocks/the_ebb_and_flow_of_time_svg/",
    mockups: [
      "/mockups-compressed/ebb&flow/mockup_boutique.webp",
      "/mockups-compressed/ebb&flow/mockup_burningman_night.webp",
      "/mockups-compressed/ebb&flow/mockup_train.webp",
      "/mockups-compressed/ebb&flow/mockup_villa.webp",
      "/mockups-compressed/ebb&flow/mockup_watchstore.webp",
    ],
  },
  {
    slug: "present-past-future",
    title: "Present, Past and Future",
    subtitle: "Three temporal modes coexisting",
    description:
      "Our subjective grasp of time is very different from the rigid, conventional representation. In our minds we often wander between past, present and future, and so does this clock (it takes some time and close attention to see it).",
    longDescription: `Our subjective grasp of time is very different from the rigid, conventional representation. In our minds we often wander between past, present and future, and so does this clock (it takes some time and close attention to see it).`,
    iframeUrl: "/meditativeclocks/clocks/present_past_and_future/",
    mockups: [
      "/mockups-compressed/present-past and future/mockup_boutique.webp",
      "/mockups-compressed/present-past and future/mockup_jet.webp",
      "/mockups-compressed/present-past and future/mockup_observatory.webp",
      "/mockups-compressed/present-past and future/mockup_spa.webp",
      "/mockups-compressed/present-past and future/mockup_winery.webp",
    ],
  },
  {
    slug: "abstract-hourglass",
    title: "Abstract Hourglass",
    subtitle: "Mortality abstracted",
    description: "This one is self-explanatory.",
    longDescription: `This one is self-explanatory.`,
    iframeUrl: "/meditativeclocks/clocks/abstract_hourglass/",
    mockups: [
      "/mockups-compressed/abstract-hourglass/mockup_contemporaryclassical_v2.webp",
      "/mockups-compressed/abstract-hourglass/mockup_concerthall.webp",
      "/mockups-compressed/abstract-hourglass/mockup_contemporaryclassical.webp",
      "/mockups-compressed/abstract-hourglass/mockup_gentlemansclub.webp",
      "/mockups-compressed/abstract-hourglass/mockup_templeretreat.webp",
    ],
  },
  {
    slug: "universe-clock",
    title: "Universe Clock",
    subtitle: "Cosmic vs. human time",
    description:
      "The small triangle is time passed since the Big Bang. The large, open triangle is time left till the end of time. The scale is logarithmic—the next pixel will appear in 86 billion years.",
    longDescription: `The small triangle is time passed since the Big Bang. The large, open triangle is time left till the end of time. The scale is logarithmic—the next pixel will appear in 86 billion years.`,
    iframeUrl: "/meditativeclocks/clocks/universe_clock/",
    mockups: [
      "/mockups-compressed/universe-clock/city-view.webp",
      "/mockups-compressed/universe-clock/mockup_bedroom(1).webp",
      "/mockups-compressed/universe-clock/mockup_gallery.webp",
      "/mockups-compressed/universe-clock/mockup_gallery_v2.webp",
      "/mockups-compressed/universe-clock/mockup_yacht.webp",
    ],
  },
  {
    slug: "serendipity-on-demand",
    title: "Serendipity on Demand",
    subtitle: "The moment of chance",
    description:
      "This clock utters a special sound, up to three times every 24 hours, at random intervals, thus connecting moments in life that otherwise wouldn't have been connected.",
    longDescription: `This clock utters a special sound, up to three times every 24 hours, at random intervals, thus connecting moments in life that otherwise wouldn't have been connected.`,
    iframeUrl: "/meditativeclocks/clocks/serendipity/",
    mockups: [
      "/mockups-compressed/serendipity-on-demand/train-station.webp",
      "/mockups-compressed/serendipity-on-demand/mockup_mallfloor_v2.webp",
      "/mockups-compressed/serendipity-on-demand/necklace_on_model_v21.webp",
      "/mockups-compressed/serendipity-on-demand/necklace_variant2.webp",
      "/mockups-compressed/serendipity-on-demand/mockup_tesla_v2.webp",
    ],
  },
];

export function getClockBySlug(slug: string): Clock | undefined {
  return clocks.find((clock) => clock.slug === slug);
}
