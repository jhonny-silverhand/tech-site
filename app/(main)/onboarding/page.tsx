'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';
import { NICHES } from '@/lib/niches';
import { Check } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  async function checkExistingProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        router.push('/');
        router.refresh();
        return;
      }
      // Pre-fill name from user metadata
      if (user.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    }
    setCheckingProfile(false);
  }

  async function checkUsernameAvailability(value: string) {
    if (!value || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', value.toLowerCase())
      .maybeSingle();
    setUsernameAvailable(!data);
  }

  async function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  }

  async function handleStep2Submit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (usernameAvailable === false) {
      setError('That username is taken');
      return;
    }
    if (usernameAvailable === null) {
      setError('Checking username...');
      return;
    }
    setError(null);
    setStep(3);
  }

  async function handleStep3Submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError('Please sign in first');
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username: username.toLowerCase(),
      display_name: name,
      bio,
      favorite_niches: selectedNiches,
    });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    // Update user metadata with display name
    await supabase.auth.updateUser({ data: { full_name: name } });

    setLoading(false);
    router.push('/');
    router.refresh();
  }

  async function handleSkip() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Create minimal profile
      try {
        await supabase.from('profiles').insert({
          id: user.id,
          display_name: name || user.email?.split('@')[0] || 'Reader',
          favorite_niches: [],
        });
      } catch {}
    }

    setLoading(false);
    router.push('/');
    router.refresh();
  }

  if (checkingProfile) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-4">Welcome back</p>
        <p className="font-display text-3xl text-ink">Checking your profile…</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-24">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-4">Welcome to tech//site</p>
          <h1 className="font-display text-4xl text-ink leading-tight">Let's set up your space.</h1>
          <p className="mt-4 text-[15px] text-muted leading-relaxed">
            A few quick steps and you're ready to read, save, and write.
          </p>
        </div>

        <form onSubmit={handleStep1Submit} className="space-y-6">
          <FieldGroup>
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we address you?"
              required
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={!name.trim()}>
            Continue
          </Button>

          <p className="text-center font-mono text-[12px] text-muted">
            <button type="button" onClick={handleSkip} className="text-accent hover:underline">
              Skip for now
            </button>
          </p>
        </form>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-24">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-4">Step 2 of 3</p>
          <h1 className="font-display text-4xl text-ink leading-tight">Choose a username</h1>
          <p className="mt-4 text-[15px] text-muted leading-relaxed">
            This will be your public profile URL: <span className="text-ink font-mono">tech-site.app/@{username}</span>
          </p>
        </div>

        <form onSubmit={handleStep2Submit} className="space-y-6">
          {error && (
            <div className="rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          <FieldGroup>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[15px] text-muted">@</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  const v = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  setUsername(v);
                  checkUsernameAvailability(v);
                }}
                placeholder="username"
                className="pl-8"
                required
                minLength={3}
                maxLength={30}
              />
            </div>
            {usernameAvailable === false && (
              <p className="mt-1 font-mono text-[11px] text-red-600">That username is taken</p>
            )}
            {usernameAvailable === true && (
              <p className="mt-1 font-mono text-[11px] text-green-600 flex items-center gap-1">
                <Check size={12} /> Available
              </p>
            )}
            {username && username.length > 0 && username.length < 3 && (
              <p className="mt-1 font-mono text-[11px] text-muted">At least 3 characters</p>
            )}
          </FieldGroup>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={!usernameAvailable}>
              Continue
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
          </div>

          <p className="text-center font-mono text-[12px] text-muted">
            <button type="button" onClick={handleSkip} className="text-accent hover:underline">
              Skip for now
            </button>
          </p>
        </form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="mx-auto max-w-sm px-4 sm:px-6 py-24">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wide text-accent mb-4">Step 3 of 3</p>
          <h1 className="font-display text-4xl text-ink leading-tight">What are you into?</h1>
          <p className="mt-4 text-[15px] text-muted leading-relaxed">
            Pick topics you care about — we'll use this to personalize your feed.
          </p>
        </div>

        <form onSubmit={handleStep3Submit} className="space-y-6">
          <FieldGroup>
            <Label>Interests (pick up to 3)</Label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((niche) => (
                <button
                  key={niche.slug}
                  type="button"
                  onClick={() => {
                    setSelectedNiches((prev) =>
                      prev.includes(niche.slug)
                        ? prev.filter((s) => s !== niche.slug)
                        : prev.length < 3
                        ? [...prev, niche.slug]
                        : prev
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                    selectedNiches.includes(niche.slug)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-muted hover:border-ink/30'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
                  {niche.label}
                </button>
              ))}
            </div>
            {selectedNiches.length > 0 && (
              <p className="mt-2 font-mono text-[11px] text-muted">
                {selectedNiches.length}/3 selected
              </p>
            )}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="bio">Bio (optional)</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A quick sentence about yourself..."
              className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono text-[13.5px] leading-relaxed min-h-[80px] resize-y"
              maxLength={160}
            />
          </FieldGroup>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Finishing up…' : 'Join tech//site'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
          </div>

          <p className="text-center font-mono text-[12px] text-muted">
            <button type="button" onClick={handleSkip} className="text-accent hover:underline">
              Skip for now
            </button>
          </p>
        </form>
      </div>
    );
  }

  return null;
}