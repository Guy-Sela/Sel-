import { clocks, getClockBySlug } from "@/lib/clocks";
import ClockPageClient from "./client";

export function generateStaticParams() {
  return clocks.map((clock) => ({
    slug: clock.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const clock = getClockBySlug(params.slug);
  if (!clock) {
    return {
      title: "Not Found | Selà",
    };
  }
  return {
    title: `${clock.title} | Conceptual Timing | Selà`,
    description: clock.description,
    openGraph: {
      title: `${clock.title} | Conceptual Timing`,
      description: clock.description,
    },
  };
}

export default function ClockPage({ params }: { params: { slug: string } }) {
  return <ClockPageClient slug={params.slug} />;
}
