## The problem Server Components solve

Client-side React ships your component code to the browser and runs it there, even for parts of the page that never change per-user and don't need interactivity — a blog post's body text, a product description, a footer. That's wasted JavaScript the visitor has to download, parse, and execute before they see anything.

React Server Components (RSCs) let a component run only on the server, sending the browser plain rendered output instead of the code needed to produce it.

## Server vs Client Components, in practice

In the Next.js App Router, every component is a Server Component by default. You opt a specific file into being a Client Component with a directive at the top:

```tsx
'use client';

import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}
```

Anything using `useState`, `useEffect`, or browser-only APIs needs `'use client'`. Everything else — data fetching, formatting, rendering static markup — can stay a Server Component and skip the client-side JavaScript bundle entirely.

## Server Components can be `async`

This is the part that trips people up coming from older React: a Server Component can be an `async` function and fetch data directly in the component body, no `useEffect` or loading state required.

```tsx
async function PostList() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

That `getPosts()` call runs on the server, close to the database, and only the resulting HTML reaches the browser.

## The mental model that actually helps

Stop thinking "is this a page or a component." Start thinking "does this piece need interactivity, state, or a browser API." If yes, it's a Client Component, and you push it as far down the tree as possible — a single button, not the whole page — so the rest of the page stays server-rendered.

## The most common mistake

Slapping `'use client'` on a whole page because one button inside it needs `onClick`. That drags every child component into the client bundle with it. Instead, extract just the interactive piece into its own small Client Component and keep everything around it on the server.
