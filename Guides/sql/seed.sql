-- Optional: a handful of sample posts, useful for confirming schema.sql and
-- its RLS policies actually work once you query them. Not required — the
-- site already shows content/articles/*.md locally until you connect
-- Supabase, and continues to demo-mode gracefully in the admin dashboard
-- even with an empty posts table. Run this in the SQL Editor any time
-- after schema.sql. Safe to re-run: it upserts on the unique slug.

insert into posts (title, slug, excerpt, content, niche, cover_image_url, status, author_id, author_name, is_ai_assisted, seo_title, seo_description, published_at)
values (
  'How to Write Better AI Prompts: A Practical Framework',
  'how-to-write-better-ai-prompts',
  'Most bad AI output is a prompting problem. A simple role/task/context/format template fixes the majority of it.',
  $body$## Most bad AI output is a prompting problem, not a model problem

When a response comes back generic, that's usually a signal the prompt was generic too. A more specific prompt almost always produces a more specific — and more useful — answer.

## The four things a good prompt gives the model

**Role.** Tell it who to be. "You're an editor at a technical publication" produces different sentences than no role at all — it sets a register and a standard.

**Context.** Give it the situation, not just the task. "Write a product description" is weak. "Write a product description for a $40 mechanical keyboard aimed at people upgrading from a laptop keyboard for the first time" tells the model who's reading and why.

**Constraints.** Length, format, tone, what to avoid. If you don't specify these, the model guesses — and its guess is usually the most generic, safest option, which is rarely what you actually wanted.

**Examples.** One good example of the output you want is worth several sentences of description. If you have a sample of the tone or format you're after, include it.

## A simple template

```
Role: [who the model should act as]
Task: [exactly what you want done]
Context: [the situation, audience, or background it needs]
Format: [length, structure, style]
Avoid: [anything specifically off-limits]
```

Fill in every line, even briefly. Skipping a line is the same as telling the model "guess."

## Iterate instead of starting over

If the first response is close but not right, don't rewrite the whole prompt — tell the model exactly what to change: "Keep the structure, but make the tone more casual and cut it to half the length." Treating it as a conversation instead of a vending machine gets to a good result faster than repeatedly rephrasing from scratch.

## One habit that fixes most problems

Before sending a prompt, read it as if you knew nothing about what you actually want. If a stranger could reasonably produce three very different answers to it, the model can too — and probably will pick the least useful one.
$body$,
  'ai-tools',
  'https://picsum.photos/seed/how-to-write-better-ai-prompts/1200/675',
  'published',
  null,
  'Admin',
  true,
  'How to Write Better AI Prompts: A Practical Framework',
  'A simple, repeatable template for writing AI prompts that actually get specific, useful answers.',
  now()
)
on conflict (slug) do nothing;

insert into posts (title, slug, excerpt, content, niche, cover_image_url, status, author_id, author_name, is_ai_assisted, seo_title, seo_description, published_at)
values (
  'Fix "Storage Space Running Out" on Android Without Losing Data',
  'fix-android-storage-full-without-losing-data',
  'Clear cache, offload backed-up photos, and find duplicates before you delete anything you actually want to keep.',
  $body$## Start with what's actually taking up space

Before deleting anything, check where your space is actually going: **Settings → Storage**. Android breaks it down by category (Apps, Photos & videos, Cached data, System), and the biggest surprise for most people is how much is cached data or duplicate photo backups, not the apps and photos they'd assume.

## Clear app cache first — it's the safest win

Cached data isn't your data; it's temporary files apps rebuild automatically. Clearing it never deletes photos, messages, or app data.

- **Settings → Storage → Cached data → Clear**, or per-app under **Settings → Apps → [app] → Storage → Clear cache**.

This alone commonly recovers several gigabytes with zero risk, especially if you have apps like browsers or social media that cache aggressively.

## Offload photos and videos instead of deleting them

If Google Photos backup is already on, most photos are already safely stored in the cloud — you just haven't freed the local copies.

- Open Google Photos → tap your profile icon → **Free up space**. This removes only the photos already confirmed backed up, leaving nothing actually lost.

## Find and remove duplicate or large files

- **Files by Google** (free) has a dedicated "Clean" tab that finds duplicate files, old screenshots, and large downloads in one place, with one-tap deletion.
- Manually check the **Downloads** folder specifically — it's the most common place large files quietly accumulate and get forgotten.

## Move what you can to an SD card or the cloud

If your phone supports expandable storage, **Settings → Storage → [SD card] → Migrate data** moves photos and some app data off internal storage without deleting anything. For phones without a card slot, offloading large files to Google Drive or a similar service accomplishes the same thing.

## Uninstall, don't just disable

Preinstalled apps you never use can often be disabled but not removed — do that too (**Settings → Apps → [app] → Disable**) since a disabled app still keeps its stored data unless you also clear it first.

## The setting that prevents this from recurring

Turn on automatic backup for photos and enable **Settings → Storage → Storage Manager** (naming varies by device) to periodically remove already-backed-up local copies on a schedule, instead of manually repeating this process every few months.
$body$,
  'android',
  'https://picsum.photos/seed/fix-android-storage-full-without-losing-data/1200/675',
  'published',
  null,
  'Admin',
  false,
  'Fix Android Storage Full Without Losing Data',
  'A safe, step-by-step order of operations to free up Android storage without deleting anything important.',
  now()
)
on conflict (slug) do nothing;

insert into posts (title, slug, excerpt, content, niche, cover_image_url, status, author_id, author_name, is_ai_assisted, seo_title, seo_description, published_at)
values (
  '5 Notion Templates That Actually Save Time',
  'notion-templates-that-save-time',
  'Low-maintenance templates that save time by reducing decisions, not by adding automation you have to babysit.',
  $body$## The test a template has to pass

A template only earns a place in your workflow if it saves more time than it costs to maintain. Plenty of beautifully designed Notion templates fail this test because they require constant upkeep to stay useful. These five are built to be low-maintenance.

## 1. A single "Today" dashboard

One page, linked from your Notion sidebar's top position, that pulls together a linked-database view filtered to today's tasks, today's calendar items, and a single freeform notes block. The entire point is having one place to look each morning instead of five.

## 2. A weekly review template with fixed prompts

A short, recurring template with the same three or four questions every week: what shipped, what's carrying over, what's blocked, and one thing to change next week. The value comes specifically from the prompts staying identical every time — that consistency is what makes patterns visible across weeks, not the specific layout.

## 3. A meeting notes template linked to a projects database

A meeting notes page with a relation property linking it to a Projects database, so every project page automatically shows a filtered list of every meeting note that mentioned it. Set this up once; after that, it's automatic every time you fill in the relation field.

## 4. A "someday" list separate from your active task list

A simple database for ideas and tasks that aren't committed to yet, explicitly separate from your real task list. The time savings here is indirect: it stops half-formed ideas from cluttering the list you're supposed to be actively working from, which keeps that list trustworthy enough to actually check daily.

## 5. A contacts database with a "last touched" date property

A simple table: name, how you know them, and a date property you update whenever you last had a real conversation. Sorted by that date, it becomes a one-glance answer to "who have I been neglecting" — useful well beyond professional networking.

## The actual time-saving mechanism

None of these save time through automation or complexity. They save time by reducing decisions: where do I look, what do I ask myself, where does this note go. A simpler template you'll actually keep updated beats an elaborate one you abandon after two weeks.
$body$,
  'productivity',
  'https://picsum.photos/seed/notion-templates-that-save-time/1200/675',
  'published',
  null,
  'Admin',
  false,
  '5 Notion Templates That Actually Save Time',
  'Five low-maintenance Notion templates built to save time by reducing decisions, not adding upkeep.',
  now()
)
on conflict (slug) do nothing;
