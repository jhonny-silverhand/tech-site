# Understanding React Server Components (Without the Hype)

React Server Components (RSC) are the biggest shift in React since hooks. The docs explain the *what*; this post explains the *why* — with the three mental models that made them click for me.

## The problem RSC solves

Classic React ships everything to the browser: your components, their dependencies, and the data-fetching waterfall that comes with `useEffect`. A page importing a date library, a charting library, and a markdown parser makes the *user* download all three — even for static content.

Server Components render on the server and send only the *result* (UI description) to the client. The libraries stay on the server. Your bundle shrinks, and data fetching happens next to the database instead of across the network.

## Mental model 1: Two kinds of components

- **Server Components** (default in Next.js App Router): run on the server. Can be async, can touch the database, can't use state, effects, or browser APIs.
- **Client Components** (`'use client'`): run in the browser. Interactive — state, effects, event handlers.

The rule of thumb: push `'use client'` as deep as possible. A page can be a Server Component that renders one small interactive Client Component (a like button, a form) instead of making the whole page interactive.

```tsx
// app/articles/[slug]/page.tsx — a Server Component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug); // direct DB access, no API route
  return (
    <article>
      <h1>{post.title}</h1>
      <MarkdownContent source={post.content} />
      <BookmarkButton postId={post.id} /> {/* small Client Component island */}
    </article>
  );
}
```

## Mental model 2: The waterfall killer

Before RSC, a typical page did this: load JS → render → `useEffect` fetches data → render → child fetches more data → render. Each arrow is a network round-trip.

With async Server Components, the server fetches everything in parallel (or streams it) *before* the browser paints. Combine with `<Suspense>` boundaries and the user sees content progressively — header first, comments later — without writing a single loading state by hand.

```tsx
<article>{/* streams immediately */}</article>
<Suspense fallback={<CommentsSkeleton />}>
  <Comments postId={post.id} /> {/* streams when ready */}
</Suspense>
```

## Mental model 3: Serialization boundary

Props passed from Server to Client components must be serializable (plain objects, strings, numbers — not functions or class instances). This is the source of most beginner errors. When you see "Functions cannot be passed directly to Client Components," it means: move the function call into the server component and pass the *result* down.

## When NOT to use them

- Highly interactive apps (editors, games, dashboards with live state): mostly Client Components is fine.
- Content that depends on browser APIs (localStorage, window size): must be client-side.
- Tiny apps where the server round-trip adds more complexity than the bundle savings.

## Key takeaways

- Server Components shrink bundles by keeping dependencies on the server.
- Push `'use client'` to the leaves; keep pages on the server.
- Use Suspense boundaries for progressive streaming.
- Props across the boundary must be serializable.
