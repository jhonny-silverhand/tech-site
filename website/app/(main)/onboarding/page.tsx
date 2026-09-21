'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NICHES } from '@/lib/niches';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from '@/components/ui/Button';

const STEPS = ['Interests', 'Experience', 'Done'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [niches, setNiches] = useState<string[]>([]);
  const [level, setLevel] = useState('beginner');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  function toggle(slug: string) {
    setNiches((n) => (n.includes(slug) ? n.filter((x) => x !== slug) : [...n, slug]));
  }

  async function finish() {
    setBusy(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) {
          router.push('/signup');
          return;
        }
        await supabase.from('profiles').update({ favorite_niches: niches }).eq('id', auth.user.id);
        for (const slug of niches.slice(0, 5)) {
          await supabase.from('topic_follows').upsert({ user_id: auth.user.id, niche_slug: slug }, { onConflict: 'user_id,niche_slug' });
        }
      }
      router.push('/');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Step {step + 1} of 3 — {STEPS[step]}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        {step === 0 && 'What are you into?'}
        {step === 1 && 'How experienced are you?'}
        {step === 2 && 'You’re all set'}
      </h1>

      {step === 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const on = niches.includes(n.slug);
            return (
              <button
                key={n.slug}
                onClick={() => toggle(n.slug)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm ${on ? 'border-transparent bg-ink text-bg' : 'border-line bg-paper text-muted hover:text-ink'}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: n.color }} />
                {n.name}
              </button>
            );
          })}
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 grid gap-3">
          {[
            { id: 'beginner', label: 'Beginner', desc: 'Explain everything, skip the jargon.' },
            { id: 'intermediate', label: 'Intermediate', desc: 'I know the basics, show me depth.' },
            { id: 'advanced', label: 'Advanced', desc: 'Trade-offs, internals, edge cases.' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`rounded-folder border p-4 text-left ${level === l.id ? 'border-accent bg-accent/5' : 'border-line bg-paper'}`}
            >
              <p className="font-medium">{l.label}</p>
              <p className="text-sm text-muted">{l.desc}</p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 rounded-folder border border-line bg-paper p-6">
          <p className="text-ink">Following {niches.length} topic{niches.length === 1 ? '' : 's'} as a {level} reader.</p>
          <p className="mt-1 text-sm text-muted">Your homepage will now show personalized picks.</p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>
        )}
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && niches.length === 0}>
            Continue
          </Button>
        ) : (
          <Button onClick={finish} disabled={busy}>{busy ? 'Saving…' : 'Finish'}</Button>
        )}
      </div>
    </div>
  );
}
