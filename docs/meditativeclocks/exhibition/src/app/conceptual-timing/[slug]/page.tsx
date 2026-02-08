import { clocks, getClockBySlug } from "@/lib/clocks";
import ClockPageClient from "./client";

export function generateStaticParams() {
  return clocks.map((clock) => ({
    slug: clock.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clock = getClockBySlug(slug);
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
      images: ["https://selà.com/og-1200x630.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${clock.title} | Conceptual Timing | Selà`,
      description: clock.description,
      images: ["https://selà.com/og-1200x630.png"],
    },
  };
}

export default async function ClockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ClockPageClient slug={slug} />;
}
