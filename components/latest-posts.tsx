import Image from "next/image";
import { Section } from "@/components/section";
import { posts } from "@/data/posts";
import { site } from "@/data/site";

export function LatestPosts() {
  // Hidden entirely when no Instagram URL is configured, so no dead links ship.
  if (!site.latestPostsUrl) return null;

  return (
    <Section
      id="latest"
      label="Latest posts"
      actions={
        <a
          href={site.latestPostsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Instagram ↗
        </a>
      }
    >
      <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.thumb.src}>
            <a
              href={post.href ?? site.latestPostsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface-2">
                <Image
                  src={post.thumb.src}
                  alt={post.thumb.alt}
                  fill
                  sizes="(min-width: 1024px) 184px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-[15px] font-medium">{post.title}</p>
              <p className="mt-1 text-sm text-muted sm:text-[13px]">{post.meta}</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
