## Check what's actually slowing you down first

**Task Manager → Startup apps** tab shows a per-app "Startup impact" rating. This is the highest-leverage five minutes you can spend — most slow boots are caused by two or three heavy startup apps, not a fundamentally slow PC.

## 1. Disable unnecessary startup apps

In that same Startup apps tab, disable anything rated "High" impact that you don't need running the instant you log in — chat apps, cloud sync clients, and update checkers are common offenders. You can still open them manually later; disabling here only stops them auto-launching at boot.

## 2. Turn on Fast Startup

**Settings → System → Power & battery → Additional power settings → Choose what the power buttons do → Turn on fast startup**. This hibernates the kernel session instead of fully shutting it down, which can noticeably cut boot time on both SSDs and hard drives.

## 3. Update or reinstall your storage driver

An outdated NVMe or SATA driver can silently slow every disk operation, boot included. Check **Device Manager → Disk drives**, right-click your main drive, and choose **Update driver**, or check your motherboard or laptop manufacturer's site for the current chipset/storage driver.

## 4. Check for a full or fragmented drive

A drive over roughly 90% full slows down noticeably, including at boot.

- **Settings → System → Storage** shows current usage — free up space if you're near the limit.
- If you're on a traditional hard drive (not an SSD), run **Optimize Drives** (search the Start menu) to defragment it. Never run this on an SSD — it doesn't need it and it adds unnecessary wear.

## 5. Trim background services you don't use

**Settings → Apps → Installed apps** — uninstall trialware and utilities you don't actually use. Many come with their own background services that start at boot regardless of whether the app itself does.

## 6. Check for pending Windows updates

An update that's downloaded but not yet installed can cause one or two unusually slow boots while it finishes applying in the background. **Settings → Windows Update** — if one's pending, let it complete rather than repeatedly interrupting it.

## 7. As a last resort, reset instead of reinstalling

If none of the above helps, years of accumulated background cruft might be the real cause. **Settings → System → Recovery → Reset this PC → Keep my files** reinstalls Windows cleanly while leaving your personal files in place — a fresh install boots noticeably faster than one that's been through years of app installs and uninstalls.
