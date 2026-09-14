'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldGroup } from '@/components/ui/Field';
import { createClient } from '@/lib/supabase/client';
import { NICHES } from '@/lib/niches';
import { Check } from 'lucide-react';

interface ProfileSettingsClientProps {
  initialProfile: {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    favorite_niches?: string[];
  } | null;
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function ProfileSettingsClient({ initialProfile, user }: ProfileSettingsClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    username: initialProfile?.username || '',
    display_name: initialProfile?.display_name || user.user_metadata?.full_name || '',
    bio: initialProfile?.bio || '',
    avatar_url: initialProfile?.avatar_url || '',
    website: initialProfile?.website || '',
    twitter: initialProfile?.twitter || '',
    github: initialProfile?.github || '',
    linkedin: initialProfile?.linkedin || '',
    favorite_niches: initialProfile?.favorite_niches || [],
  });

  async function checkUsernameAvailability(value: string) {
    if (!value || value.length < 3 || value === initialProfile?.username) {
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

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
    if (name === 'username') {
      checkUsernameAvailability(value);
    }
  }

  function handleNicheToggle(slug: string) {
    setFormData((prev) => ({
      ...prev,
      favorite_niches: prev.favorite_niches.includes(slug)
        ? prev.favorite_niches.filter((s) => s !== slug)
        : prev.favorite_niches.length < 3
        ? [...prev.favorite_niches, slug]
        : prev.favorite_niches,
    }));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.username.trim() || formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (usernameAvailable === false) {
      setError('That username is taken');
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: formData.username.toLowerCase(),
        display_name: formData.display_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        website: formData.website,
        twitter: formData.twitter,
        github: formData.github,
        linkedin: formData.linkedin,
        favorite_niches: formData.favorite_niches,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      setSaving(false);
      setError(profileError.message);
      return;
    }

    // Update user metadata with display name
    await supabase.auth.updateUser({ data: { full_name: formData.display_name } });

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-folder border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-folder border border-line bg-paper px-4 py-3 text-[13.5px] text-muted">
          Profile updated.
        </div>
      )}

      {/* Avatar */}
      <FieldGroup>
        <Label>Avatar URL</Label>
        <Input
          name="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
        {formData.avatar_url && (
          <div className="mt-2">
            <Image
              src={formData.avatar_url}
              alt="Preview"
              width={64}
              height={64}
              className="rounded-full object-cover border border-line"
            />
          </div>
        )}
        <p className="mt-1 font-mono text-[11px] text-muted">Link to an image (Gravatar, Cloudinary, etc.)</p>
      </FieldGroup>

      {/* Username */}
      <FieldGroup>
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[15px] text-muted">@</span>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username"
            className="pl-8"
            minLength={3}
            maxLength={30}
            disabled={saving}
          />
        </div>
        {formData.username && formData.username !== initialProfile?.username && usernameAvailable === false && (
          <p className="mt-1 font-mono text-[11px] text-red-600">That username is taken</p>
        )}
        {formData.username && formData.username !== initialProfile?.username && usernameAvailable === true && (
          <p className="mt-1 font-mono text-[11px] text-green-600 flex items-center gap-1">
            <Check size={12} /> Available
          </p>
        )}
        {formData.username && formData.username.length > 0 && formData.username.length < 3 && (
          <p className="mt-1 font-mono text-[11px] text-muted">At least 3 characters</p>
        )}
        <p className="mt-1 font-mono text-[11px] text-muted">Your profile: tech-site.app/@{formData.username || 'username'}</p>
      </FieldGroup>

      {/* Display Name */}
      <FieldGroup>
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          placeholder="Your name"
        />
      </FieldGroup>

      {/* Bio */}
      <FieldGroup>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="A quick sentence about yourself..."
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono text-[13.5px] leading-relaxed min-h-[80px] resize-y"
          maxLength={160}
        />
        <p className="mt-1 font-mono text-[11px] text-muted">{formData.bio.length}/160</p>
      </FieldGroup>

      {/* Interests */}
      <FieldGroup>
        <Label>Interests (pick up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => (
            <button
              key={niche.slug}
              type="button"
              onClick={() => handleNicheToggle(niche.slug)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                formData.favorite_niches.includes(niche.slug)
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-muted hover:border-ink/30'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: niche.color }} />
              {niche.label}
            </button>
          ))}
        </div>
        {formData.favorite_niches.length > 0 && (
          <p className="mt-2 font-mono text-[11px] text-muted">
            {formData.favorite_niches.length}/3 selected
          </p>
        )}
      </FieldGroup>

      {/* Links */}
      <FieldGroup>
        <Label>Links</Label>
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted">🌐</span>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="pl-8"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted">𝕏</span>
            <Input
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="Twitter handle (without @)"
              className="pl-8"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted">⌘</span>
            <Input
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub username"
              className="pl-8"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted">in</span>
            <Input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn username"
              className="pl-8"
            />
          </div>
        </div>
      </FieldGroup>

      <Button type="submit" disabled={saving || (!formData.username && !initialProfile?.username)}>
        {saving ? 'Saving…' : saved ? 'Saved' : 'Save profile'}
      </Button>
    </form>
  );
}