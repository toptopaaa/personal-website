export type Post = {
  title: string;
  meta: string;
  // Optional permalink. Without it, the item links to the Instagram profile (site.latestPostsUrl).
  href?: string;
  thumb: {
    src: string;
    alt: string;
  };
};

// TODO: all three entries are placeholders. Replace titles, meta, thumbnails, and add permalinks.
export const posts: readonly Post[] = [
  {
    title: "[TODO: post title]",
    meta: "[TODO: format · views]",
    thumb: { src: "/posts/post-1.webp", alt: "[TODO] Thumbnail for post 1" },
  },
  {
    title: "[TODO: post title]",
    meta: "[TODO: format · views]",
    thumb: { src: "/posts/post-2.webp", alt: "[TODO] Thumbnail for post 2" },
  },
  {
    title: "[TODO: post title]",
    meta: "[TODO: format · views]",
    thumb: { src: "/posts/post-3.webp", alt: "[TODO] Thumbnail for post 3" },
  },
];
