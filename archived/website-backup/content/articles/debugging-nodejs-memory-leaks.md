## The symptom before the diagnosis

A Node process that gets slower over hours or days, then eventually crashes with something like `JavaScript heap out of memory`, is almost always a memory leak: objects that should have been garbage collected are still being referenced somewhere, so they pile up.

## Step 1: confirm it's actually growing

Before hunting for a cause, confirm there is one. Run the process with:

```bash
node --expose-gc --inspect app.js
```

Open `chrome://inspect` in Chrome, connect to the process, and take a heap snapshot under the Memory tab. Wait a few minutes under normal load, take a second snapshot, and compare. If retained size keeps climbing across snapshots with no plateau, that's a real leak, not just normal fluctuation.

## Step 2: look for the usual suspects first

Most Node memory leaks come from one of these patterns:

- **Event listeners that are added but never removed** — especially on long-lived objects like a shared `EventEmitter`, where every new request adds another listener that never gets cleaned up.
- **Caches with no eviction policy** — a plain object or `Map` used as a cache, growing forever because nothing ever calls `.delete()`.
- **Closures holding references to large objects** — a callback stored somewhere long-lived that closes over a large object it no longer actually needs.
- **Timers that are never cleared** — a `setInterval` that outlives the thing it was set up for, keeping its whole closure alive.

## Step 3: use the snapshot comparison to find it

In Chrome DevTools' Memory tab, use "Comparison" view between your two snapshots. Sort by "# Delta" to see which object types grew the most between snapshots — that list is almost always where the leak lives. Click into a growing constructor name and look at "Retainers" to see what's holding onto it.

## Step 4: fix, then verify

Once you've patched the suspected cause, repeat the two-snapshot comparison under the same load. Retained size for that object type should now plateau instead of climbing. If it still grows, you found *a* leak, not necessarily *the* leak — there's often more than one.

## A cheap habit that prevents most of these

Any time you write `.on(`, `setInterval(`, or add to a cache, immediately write down (in a comment if nothing else) where the corresponding `.off()`, `clearInterval()`, or eviction happens. If you can't answer that immediately, you've probably just created a leak.
