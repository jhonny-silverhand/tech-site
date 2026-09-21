# AI drafting setup (admin only)

This turns on the "Generate draft" button in the admin post editor. Regular users never see this — it's wired into exactly one place: `app/api/admin/generate/route.ts`, which checks the admin session before doing anything.

## 1. Get a free Gemini API key

1. Go to https://aistudio.google.com/apikey
2. Sign in, create a key (no cost, generous free tier as of writing)
3. Copy it

## 2. Add it to your app

In `website/.env.local`:

```
GEMINI_API_KEY=your-key-here
```

Restart `npm run dev`. The "Generate draft" panel in `/admin/posts/new` will now work.

## 3. If generation starts failing

Google occasionally renames or retires specific model versions. The model name is a single constant at the top of `lib/ai.ts`:

```ts
const MODEL = 'gemini-2.5-flash';
```

If you get a 404 or "model not found" error, check https://ai.google.dev/gemini-api/docs/models for the current free-tier model name and update that one line.

## Swapping in a different provider

The original plan for this project listed several free/low-cost options (OpenRouter, HuggingFace Inference API, Together AI, a locally-run Ollama model). Any of them can replace Gemini — `lib/ai.ts` is the *only* file that talks to an AI provider, so that's the only file you'd need to change. Keep the same function signature (`generateDraft(topic, nicheSlug) → GeneratedDraft`) and the rest of the app — the admin UI, the API route, the JSON parsing expectations — doesn't need to change at all.

## A reminder worth keeping in mind

The admin UI always treats a generated draft as a starting point, not a finished article — the fields land in the editor for review, nothing auto-publishes. Worth keeping it that way: search engines have gotten noticeably stricter about large volumes of unedited AI content, so the editing step protects rankings later, not just quality now.
