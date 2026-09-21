export interface SeedGuide {
  title: string;
  slug: string;
  excerpt: string;
  category_slug: string;
  author_name: string;
  content: string;
  picks: { product_slug: string; label: string; reason: string; pros: string[]; cons: string[] }[];
}

export const SEED_GUIDES: SeedGuide[] = [
  {
    title: 'Best Phones Under ₹10,000 (2026)',
    slug: 'best-phones-under-10000',
    excerpt: 'Three phones under ₹10K that are actually usable — big batteries, clean software, decent cameras.',
    category_slug: 'smartphones',
    author_name: 'Rahul Verma',
    content: `## How we picked\n\nUnder ₹10,000 you must prioritize: **battery (5000mAh+)**, **4GB+ RAM**, and **clean, updateable software**. Camera quality is a bonus, not a given.\n\n## What to avoid\n\n- Phones with 2GB/3GB RAM — they stutter within months.\n- "eMMC" storage if UFS is available at the same price.\n- No-name brands with zero service centres.\n\n## Our picks\n\n### Best Overall: Moto G85-class value\nLook for a Snapdragon 6-series chip, 120Hz display and near-stock Android. Motorola's update record at this price is the most trustworthy.\n\n### Battery King\nAny 6000mAh phone with 25W+ charging. If you travel or face power cuts, battery beats camera every time.\n\n### Key takeaways\n\n- 4GB RAM is the floor; 6GB is comfortable.\n- Prefer UFS storage and 5G support for longevity.\n- Buy during sale events — prices drop 10-15%.`,
    picks: [
      { product_slug: 'moto-g85', label: 'Best Overall', reason: 'Clean software, 144Hz pOLED display and OIS camera — rare at this price.', pros: ['Near-stock Android', '144Hz pOLED display'], cons: ['33W charging is average'] },
    ],
  },
  {
    title: 'Best Phones Under ₹15,000 (2026)',
    slug: 'best-phones-under-15000',
    excerpt: 'The sweet spot for students: 5G, 120Hz AMOLED and cameras that survive low light.',
    category_slug: 'smartphones',
    author_name: 'Rahul Verma',
    content: `## The ₹15K formula\n\nAt this budget insist on: **AMOLED 120Hz**, **5G**, **5000mAh + 44W charging**, and a **main camera with OIS or a large sensor**.\n\n## Our picks\n\n### Best Camera: realme Narzo 70 Pro class\nThe Sony IMX890 with OIS takes visibly cleaner night shots than anything else here.\n\n### Key takeaways\n\n- AMOLED > LCD at this price, always.\n- 8GB RAM variants are worth the ₹1-2K premium.\n- Check update policy: 2 OS updates minimum.`,
    picks: [
      { product_slug: 'realme-narzo-70-pro', label: 'Best Camera', reason: 'Flagship Sony sensor with OIS under ₹20K.', pros: ['Superb night photos', '67W fast charging'], cons: ['Preinstalled apps need cleanup'] },
      { product_slug: 'moto-g85', label: 'Best Software', reason: 'Clean Android with useful Moto gestures.', pros: ['No bloatware', 'Stereo speakers'], cons: ['Slower charging'] },
    ],
  },
  {
    title: 'Best Phones Under ₹20,000 (2026)',
    slug: 'best-phones-under-20000',
    excerpt: 'Flagship features trickle down: OIS cameras, curved AMOLEDs and 67W charging.',
    category_slug: 'smartphones',
    author_name: 'Rahul Verma',
    content: `## What ₹20K buys you\n\nCurved AMOLED displays, OIS cameras, 67W+ charging and 5G on every serious contender. The differences are software and after-sales.\n\n## Key takeaways\n\n- Camera OIS matters more than megapixels.\n- Prefer brands with service centres in your city.\n- 256GB storage variants are worth it if you shoot video.`,
    picks: [
      { product_slug: 'realme-narzo-70-pro', label: 'Best Overall', reason: 'Best camera + display combo under ₹20K.', pros: ['IMX890 OIS camera', '120Hz AMOLED'], cons: ['Software has bloatware'] },
      { product_slug: 'redmi-note-13-pro', label: 'Also Great', reason: '200MP camera and premium curved design.', pros: ['Versatile cameras', '67W charging'], cons: ['MIUI ads need disabling'] },
    ],
  },
  {
    title: 'Best Phones Under ₹8,000 (2026)',
    slug: 'best-phones-under-8000',
    excerpt: 'Basic but not broken: what to buy for calls, WhatsApp, UPI and YouTube.',
    category_slug: 'smartphones',
    author_name: 'Rahul Verma',
    content: `## Survival guide for ultra-budget\n\nSet expectations: HD+ display, 4GB RAM, 64GB storage. Prioritize **battery + after-sales** over specs on paper.\n\n## Key takeaways\n\n- Buy from brands with local service.\n- Add a microSD card on day one.\n- Keep 20% storage free or the phone will crawl.`,
    picks: [
      { product_slug: 'boat-airdopes-161', label: 'Pair It With', reason: 'Cheap buds complete a budget kit for music and calls.', pros: ['Very cheap', 'Long case backup'], cons: ['No ANC'] },
    ],
  },
  {
    title: 'Best Phones Under ₹5,000 (2026)',
    slug: 'best-phones-under-5000',
    excerpt: 'For first-time smartphone users: the minimum viable phone, honestly assessed.',
    category_slug: 'smartphones',
    author_name: 'Rahul Verma',
    content: `## Honest advice\n\nUnder ₹5,000, consider a **refurbished phone** from a reputed seller — a 2-year-old Redmi or Samsung beats any new phone at this price.\n\n## If buying new\n\n- 4GB RAM minimum, Android Go edition preferred.\n- 5000mAh battery is non-negotiable.\n- Expect to replace in 18 months.\n\n## Key takeaways\n\n- Refurbished > new at this budget.\n- Check warranty terms carefully.`,
    picks: [],
  },
  {
    title: 'Best Laptops for Students in India (2026)',
    slug: 'best-laptops-for-students',
    excerpt: 'From ₹39K to ₹95K: five laptops for coding, notes and Netflix — ranked by value.',
    category_slug: 'laptops',
    author_name: 'Sana Sheikh',
    content: `## What students actually need\n\n**16GB RAM** (or upgradeable 8GB), **512GB SSD**, **under 1.8kg**, and **6+ hour battery**. A great keyboard beats a slightly faster CPU.\n\n## The ranking logic\n\n1. Budget coders: Acer Aspire Lite — 6 cores, upgradeable.\n2. All-rounders: ASUS Vivobook / HP 15s — better screens and battery.\n3. Money-no-object: MacBook Air M2 — silent, lasts all day.\n\n## Key takeaways\n\n- Never buy 8GB soldered RAM in 2026 if you code.\n- SSD must be NVMe; avoid eMMC.\n- Student discounts save 5-10% — always ask.`,
    picks: [
      { product_slug: 'acer-aspire-lite-5500u', label: 'Best Value', reason: '6-core Ryzen with upgradeable RAM under ₹40K.', pros: ['Great price', 'Upgradeable'], cons: ['Average display'] },
      { product_slug: 'apple-macbook-air-m2-13', label: 'Premium Pick', reason: 'Best battery, display and build for those who can stretch.', pros: ['18-hour battery', 'Superb display'], cons: ['Expensive', '8GB base RAM'] },
      { product_slug: 'hp-15s-7730u', label: 'Best Performance', reason: '8-core Ryzen chews through multitasking.', pros: ['Fast CPU', 'Fast charging'], cons: ['Heavier at 1.7kg'] },
    ],
  },
  {
    title: 'Best Headphones Under ₹5,000 (2026)',
    slug: 'best-headphones-under-5000',
    excerpt: 'Bass, battery and comfort ranked — the only three budget buds worth your money.',
    category_slug: 'headphones',
    author_name: 'Dev Patel',
    content: `## How to judge budget audio\n\nIgnore "ENC" marketing. Test: **fit**, **40mm+ drivers or tuned 13mm buds**, **Bluetooth 5.3**, and **real-world battery**.\n\n## Key takeaways\n\n- Sony WF-C510 for sound quality; boAt for pure value.\n- Foam tips (₹300) upgrade any buds' bass.\n- Multipoint matters if you juggle laptop + phone.`,
    picks: [
      { product_slug: 'sony-wf-c510', label: 'Best Sound', reason: 'Genuinely good tuning from an audio brand.', pros: ['Clear, balanced sound', 'Compact fit'], cons: ['No ANC'] },
      { product_slug: 'boat-airdopes-161', label: 'Budget Pick', reason: 'Unbeatable at ₹1,300 with 40-hour backup.', pros: ['Very cheap', 'Long battery'], cons: ['Muddy bass'] },
    ],
  },
  {
    title: 'Complete PC Building Guide for India (2026)',
    slug: 'pc-building-guide-india',
    excerpt: 'Every part explained with Indian prices: build a 1080p gaming PC from ₹55K.',
    category_slug: 'pc-components',
    author_name: 'Dev Patel',
    content: `## The ₹55K 1080p formula\n\n- CPU: Ryzen 5 7600 (~₹18K) — 6 fast cores, stock cooler included.\n- GPU: RTX 4060 (~₹29K) — DLSS 3 makes it a 1440p-capable card.\n- Board: B650M with Wi-Fi (~₹15K).\n- RAM: 16GB DDR5-5600 (~₹5.5K).\n- SSD: 1TB Gen4 (~₹8.5K).\n- PSU: 550-650W Bronze from a known brand (~₹5K).\n- Case + cooler: airflow mesh case (~₹4K).\n\n## Where to buy\n\nCompare mdcomputers.in, vedantcomputers.com, Amazon and local SP Road / Nehru Place shops. GPUs are often ₹1-2K cheaper offline.\n\n## Assembly tips\n\n1. Build outside the case first (breadboard test).\n2. Update BIOS before installing Windows.\n3. Enable EXPO for RAM + Resizable BAR for GPU.\n\n## Key takeaways\n\n- Never cheap out on the PSU.\n- 16GB RAM is the 2026 minimum for gaming.\n- Try the AI PC Builder above for your exact budget.`,
    picks: [
      { product_slug: 'amd-ryzen-5-7600', label: 'Best Value CPU', reason: 'Gaming performance per rupee is unmatched.', pros: ['Fast 6 cores', 'Stock cooler included'], cons: ['Needs AM5 board + DDR5'] },
      { product_slug: 'nvidia-rtx-4060-8gb', label: 'Best 1080p GPU', reason: 'DLSS 3 + efficiency make it the rational pick.', pros: ['DLSS 3 frame gen', 'Low power'], cons: ['8GB VRAM limit at 1440p ultra'] },
      { product_slug: 'samsung-980-pro-1tb', label: 'Best SSD', reason: 'Top-tier speed and endurance for OS + games.', pros: ['7000 MB/s reads', '600 TBW'], cons: ['Slightly pricey'] },
    ],
  },
];
