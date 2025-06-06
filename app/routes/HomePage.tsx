// import type { SanityDocument } from "@sanity/client";
import { Link } from "react-router";
import { client } from "~/sanity/client";
import type { Route } from "./+types/HomePage";

// const POSTS_QUERY = `*[
//   _type == "post"
//   && defined(slug.current)
// ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

// export async function loader() {
//   return { posts: await client.fetch<SanityDocument[]>(POSTS_QUERY) };
// }

export default function HomePage({ /*loaderData*/ }: Route.ComponentProps) {
//   const { posts } = loaderData;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
        
            </main>
  );
}