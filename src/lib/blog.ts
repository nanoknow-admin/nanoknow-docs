import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function topicSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => {
    // Teasers trail the finished posts regardless of their planned date.
    if (a.data.comingSoon !== b.data.comingSoon) {
      return a.data.comingSoon ? 1 : -1;
    }
    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });
}

export async function getAllTopics(): Promise<
  { label: string; slug: string }[]
> {
  const labels = new Map<string, string>();

  for (const post of await getPublishedPosts()) {
    for (const topic of post.data.topics) {
      const slug = topicSlug(topic);
      if (!labels.has(slug)) labels.set(slug, topic);
    }
  }

  return [...labels.entries()]
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    // Date-only frontmatter parses to UTC midnight, so format in UTC to keep
    // the rendered day from shifting backwards in negative-offset timezones.
    timeZone: "UTC",
  });
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
