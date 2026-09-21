# Debugging Node.js Memory Leaks: A Field Guide

Production Node.js processes rarely crash loudly. They get slow, then slower, then the orchestrator kills them at 2 AM. Nine times out of ten, it's a memory leak — and four patterns cause nearly all of them.

## Confirming it's a leak (not just usage)

A healthy process's heap rises under load and falls after GC. A leak rises and never fully falls. Check with:

```bash
# Watch heap over time (every 5s)
node --expose-gc -e "
setInterval(() => {
  const m = process.memoryUsage();
  console.log('heapUsed:', (m.heapUsed/1024/1024).toFixed(1), 'MB',
              'rss:', (m.rss/1024/1024).toFixed(1), 'MB');
}, 5000);
"
```

If `heapUsed` climbs monotonically across multiple GC cycles under steady load, you have a leak. Confirm with a heap snapshot comparison in Chrome DevTools (`chrome://inspect` → Memory → take two snapshots an hour apart → filter by "Objects allocated between snapshots").

## Pattern 1: Unbounded caches and arrays

```js
// LEAK: grows forever
const recentRequests = [];
app.use((req, res, next) => {
  recentRequests.push({ url: req.url, body: req.body, at: Date.now() });
  next();
});
```

**Fix:** use an LRU cache with a cap, or a ring buffer.

```js
import { LRUCache } from 'lru-cache';
const recentRequests = new LRUCache({ max: 500, ttl: 1000 * 60 * 10 });
```

## Pattern 2: Forgotten event listeners

Every `emitter.on()` without a matching `removeListener` pins the handler — and everything it closes over — forever. Watch for listeners added per-request or per-connection.

```js
// LEAK: new listener per request, never removed
app.get('/stream', (req, res) => {
  dataFeed.on('update', (chunk) => res.write(chunk));
});
```

**Fix:** use `once`, or remove on close:

```js
app.get('/stream', (req, res) => {
  const handler = (chunk) => res.write(chunk);
  dataFeed.on('update', handler);
  req.on('close', () => dataFeed.removeListener('update', handler));
});
```

Node warns at 10+ listeners on one emitter (`MaxListenersExceededWarning`) — treat that warning as a bug report.

## Pattern 3: Timers that outlive their purpose

`setInterval` keeps its closure alive until cleared. Audit every `setInterval`/`setTimeout` for a clear path, and prefer `timer.unref()` for background housekeeping so timers don't hold the process open.

## Pattern 4: ORM / query accumulation

Loading 100K rows into memory to count them, N+1 queries building giant object graphs, or a global array of "all connections." Fix with cursors/streams, pagination, and projecting only needed columns.

## Tooling: clinic.js

```bash
npm i -g clinic
clinic doctor -- node server.js
# then load-test it; clinic flags leaks, event-loop lag, GC pressure
```

`clinic doctor` distinguishes leaks from event-loop blockage — different fixes, similar symptoms.

## Key takeaways

- Verify with heap snapshots before optimizing.
- Cap every cache; pair every listener with removal; clear every timer.
- Treat `MaxListenersExceededWarning` as a bug.
- Use `clinic doctor` to separate leaks from event-loop issues.
