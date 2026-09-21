# Speed Up Windows 11 Boot Time: 9 Fixes That Work

A fresh Windows 11 install boots in 15 seconds. A year later, it takes 90. Here's how to get back under 20 — ordered from biggest impact to smallest.

## 1. Audit startup apps (biggest win)

Open **Task Manager → Startup apps**. Sort by **Startup impact**. Disable everything marked High that you don't need within 60 seconds of login: updaters, chat clients, game launchers, Adobe background processes.

Keep enabled: antivirus, audio drivers, cloud sync you actually use. Everything else can launch on demand.

## 2. Fix Fast Startup (when it's the problem)

**Settings → System → Power → Additional power settings → Choose what the power buttons do → Turn on fast startup.** If boot is *slow*, try *disabling* it — on systems with older drivers or HDDs, Fast Startup's hibernation file causes longer, glitchier boots. Test both; keep whichever boots faster.

## 3. Check your drive health

An SSD at 95%+ capacity or with failing cells boots slowly no matter what you tweak. Keep **20% free**, and check health with CrystalDiskInfo (free). If health is "Caution," back up immediately — no software fix helps a dying drive.

## 4. Switch to an SSD (if you're still on HDD)

No software tweak compensates for a spinning disk. A ₹3,500 SATA SSD makes a 2018 laptop feel new. Clone with Macrium Reflect Free, swap, done.

## 5. Update BIOS and storage drivers

Boot hangs are often driver timeouts. Update: BIOS (from your laptop/motherboard maker), Intel RST / AMD chipset drivers, and GPU drivers. Do BIOS on AC power, battery >50%.

## 6. Disable unnecessary services (carefully)

`Win + R → msconfig → Services → Hide all Microsoft services`. Disable third-party updaters (Adobe, printer utilities). Leave anything from your antivirus and hardware vendors alone.

## 7. Turn off transparency and animations

**Settings → Accessibility → Visual effects →** turn off transparency and animation effects. Minor on fast machines, noticeable on 4GB/older iGPUs.

## 8. Scan for malware and crypto miners

Sudden boot slowdowns + high idle CPU = infection. Run **Windows Security → Full scan** plus a Malwarebytes Free scan. Miners love to persist via startup entries.

## 9. Reset (the honest last resort)

**Settings → System → Recovery → Reset this PC → Keep my files.** 30 minutes, and boot times return to day-one. Reinstall only the apps you actually opened last month.

## Measure, don't guess

Time boots properly: **Task Manager → Startup apps → "Last BIOS time"** (firmware) plus a stopwatch from power-button to usable desktop. Change one thing, measure, repeat.

## Key takeaways

- Startup-app audit is 80% of the fix.
- Keep 20% SSD free; check drive health.
- Nothing beats an SSD if you're still on HDD.
