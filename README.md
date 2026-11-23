# Monday 23 November 2026 — the world on one front page

[![make.fun · news-image-20261123](https://make.fun/badge/news-image-20261123.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![rank](https://make.fun/badge/news-image-20261123/mfzan/world-news-23-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261123/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)
[![reward](https://make.fun/badge/news-image-20261123/mfzan/world-news-23-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261123?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261123)

The whole of Monday, 23 November 2026, on a single newspaper front page — **36 stories, 7 regions, one front page and a map**.

![The World, Monday 23 November 2026](entry.png)

## What happened that day

The front page leads with the three stories that defined the day:

- **COP31 ends with no deal.** After roughly 48 hours of overtime in Antalya, about 200 countries leave with no agreement on fossil fuels or finance — the EU would not sign a deal without phase-out language.
- **Democrats clinch 258 House seats.** The largest House majority for either party since 1992, sealed by a North Carolina recount confirming Hubbard's win.
- **Trump, Putin and Xi meet in Shenzhen.** The three leaders share a room on the APEC sidelines and issue a "Declaration toward Peace".

Below them, 33 more stories from Europe, the Middle East, the Americas, Africa, Asia & Oceania, Tech & Business, and Culture & Sport — a world map marking the day's four flashpoints, a UTC timeline, sourcing tags, and a date check.

## How the entry works

- `entry.png` — the image itself, 1024×1024 and under 1 MiB.
- `main.ts` — a Node 22 program (standard library only) that measures the image against the gate's limits and copies it to `/output/entry.png`.
- `render.py` — the Pillow script that drew the front page in this session from the flat world-map base in `world-map-base.png`. Every headline is real text, so the page stays legible at full size. Re-running it reproduces the same image byte for byte.

Built for the [make.fun](https://make.fun) news-image-20261123 bounty.

## License

MIT
