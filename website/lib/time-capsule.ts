/** "From the archive" — a daily time capsule of widely documented
 *  technology-history milestones, hand-curated (no AI, no scraping).
 *
 *  One entry is shown per UTC day, picked deterministically so the pick is
 *  stable for the whole day. Entries list the event's own historical date;
 *  the widget makes no claim that the event happened *today*. */

export type CapsuleEntry = {
  /** Historical date of the event (ISO). */
  date: string;
  /** Short headline. */
  title: string;
  /** One-line context, ≤ ~140 chars. */
  detail: string;
};

export const CAPSULE_ENTRIES: CapsuleEntry[] = [
  {
    date: '1876-03-10',
    title: '"Mr. Watson, come here"',
    detail: 'Alexander Graham Bell makes the first telephone call in his Boston laboratory.',
  },
  {
    date: '1947-12-23',
    title: 'The transistor is demonstrated',
    detail: 'Bardeen and Brattain show the first point-contact transistor at Bell Labs.',
  },
  {
    date: '1958-09-12',
    title: 'The first integrated circuit',
    detail: 'Jack Kilby demos a working IC at Texas Instruments — the start of miniaturized electronics.',
  },
  {
    date: '1965-04-19',
    title: "Moore's Law is published",
    detail: 'Gordon Moore\'s article "Cramming more components onto integrated circuits" runs in Electronics.',
  },
  {
    date: '1968-12-09',
    title: 'The Mother of All Demos',
    detail: 'Douglas Engelbart shows the mouse, hypertext, and video conferencing in one 90-minute presentation.',
  },
  {
    date: '1969-07-20',
    title: 'A computer lands on the Moon',
    detail: 'Apollo 11 touches down guided by the 70-pound Apollo Guidance Computer.',
  },
  {
    date: '1969-10-29',
    title: 'The first ARPANET message',
    detail: 'UCLA tries to send "LOGIN" to Stanford — the system crashes after two letters: "LO".',
  },
  {
    date: '1973-04-03',
    title: 'The first handheld cell call',
    detail: 'Motorola\'s Martin Cooper phones a rival at Bell Labs from a New York sidewalk.',
  },
  {
    date: '1975-04-04',
    title: 'Microsoft is founded',
    detail: 'Bill Gates and Paul Allen register the company in Albuquerque to build BASIC interpreters.',
  },
  {
    date: '1976-04-01',
    title: 'Apple Computer is founded',
    detail: 'Jobs, Wozniak, and Wayne form the partnership that starts in the Jobs family garage.',
  },
  {
    date: '1981-08-12',
    title: 'The IBM PC launches',
    detail: 'The model 5150 sets the de-facto standard for personal computers and clones.',
  },
  {
    date: '1983-01-01',
    title: "The Internet's flag day",
    detail: 'ARPANET switches from NCP to TCP/IP — the protocol suite the net still runs on.',
  },
  {
    date: '1984-01-24',
    title: 'The Macintosh is unveiled',
    detail: 'Apple introduces the Mac two days after its landmark "1984" Super Bowl ad.',
  },
  {
    date: '1985-03-15',
    title: 'The first .com domain',
    detail: 'symbolics.com is registered — the oldest surviving .com on the web.',
  },
  {
    date: '1989-03-12',
    title: 'The web is proposed',
    detail: 'Tim Berners-Lee circulates "Information Management: A Proposal" at CERN.',
  },
  {
    date: '1990-11-12',
    title: 'WorldWideWeb gets its spec',
    detail: 'Berners-Lee and Robert Cailliau publish the formal proposal for a hypertext project.',
  },
  {
    date: '1991-08-06',
    title: 'The first website goes live',
    detail: 'info.cern.ch describes the web itself — the page is still reachable today.',
  },
  {
    date: '1992-12-03',
    title: 'The first text message',
    detail: 'Neil Papworth SMSes "Merry Christmas" to a phone on the Vodafone network.',
  },
  {
    date: '1993-04-30',
    title: 'The web goes royalty-free',
    detail: 'CERN releases the WWW source code into the public domain, letting anyone build a browser.',
  },
  {
    date: '1994-10-27',
    title: 'The first banner ad',
    detail: 'AT&T\'s "Have you ever clicked your mouse right HERE?" runs on HotWired.',
  },
  {
    date: '1995-08-24',
    title: 'Windows 95 launches',
    detail: 'Start button, taskbar, and a Rolling Stones soundtrack define computing for a decade.',
  },
  {
    date: '1997-05-11',
    title: 'Deep Blue beats Kasparov',
    detail: 'IBM\'s machine takes the match 3.5–2.5 — a first against a reigning world chess champion.',
  },
  {
    date: '1998-09-04',
    title: 'Google is incorporated',
    detail: 'Page and Brin register their search engine in a Menlo Park garage.',
  },
  {
    date: '2000-01-01',
    title: 'Y2K fizzles',
    detail: 'The much-feared date bug passes with mostly minor glitches worldwide.',
  },
  {
    date: '2001-10-23',
    title: 'The iPod is introduced',
    detail: '"1,000 songs in your pocket" resets the music industry\'s economics.',
  },
  {
    date: '2004-02-04',
    title: 'Facebook launches',
    detail: 'thefacebook.com goes live for Harvard students from a dorm-room server.',
  },
  {
    date: '2005-04-23',
    title: '"Me at the zoo"',
    detail: 'The first YouTube video — 19 seconds of elephants — is uploaded.',
  },
  {
    date: '2006-03-21',
    title: 'The first tweet',
    detail: 'Jack Dorsey posts "just setting up my twttr" — spelled without the vowels.',
  },
  {
    date: '2007-01-09',
    title: 'The iPhone is unveiled',
    detail: 'Steve Jobs shows "an iPod, a phone, and an Internet communicator" — one device.',
  },
  {
    date: '2007-06-29',
    title: 'The iPhone goes on sale',
    detail: 'Queues form outside Apple stores; the smartphone era begins in earnest.',
  },
  {
    date: '2007-11-05',
    title: 'Android is announced',
    detail: 'Google unveils the Open Handset Alliance and a Linux-based phone OS.',
  },
  {
    date: '2008-07-10',
    title: 'The App Store opens',
    detail: '500 launch apps create a new economy for software on phones.',
  },
  {
    date: '2008-09-02',
    title: 'Chrome 1.0 beta ships',
    detail: 'Google\'s browser debuts with a comic book and a speed-first pitch.',
  },
  {
    date: '2010-04-03',
    title: 'The iPad goes on sale',
    detail: 'Apple sells 300,000 tablets on day one and revives tablet computing.',
  },
  {
    date: '2016-03-15',
    title: 'AlphaGo wins the series',
    detail: 'DeepMind\'s program beats Lee Sedol 4–1 in Seoul, a decade earlier than predicted.',
  },
];

/** Deterministic daily pick — stable for the whole UTC day. */
export function getTodaysCapsule(now: Date = new Date()): CapsuleEntry {
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000);
  return CAPSULE_ENTRIES[dayOfYear % CAPSULE_ENTRIES.length];
}
