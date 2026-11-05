# NOIR content library

The trip photos and videos live in iCloud shared albums, one or more per
trip. They are the source material for all NOIR content (reels, posts,
site imagery, recaps). A new album is added each year.

**The album links are not stored here.** This repo is public, and a shared
album link opens every photo and video in it. Keep the links somewhere
private and paste them in when you start a content session.

## Trips

| Year | Destination | Album name | Photos | Videos | Dates in album | 720p size |
|---|---|---|---|---|---|---|
| 2023 | Cabo | NSTC CABO 2023 | 625 | 311 | Jul 26 2023 onward | 1.8 GB |
| 2023 | Cabo (catamaran day) | NSTC Catamaran | 136 | 194 | Jul 29–30 2023 | 1.0 GB |
| 2024 | Punta Cana | NOIR2024 | 441 | 310 | Jul 17 – Sep 26 2024 | 1.9 GB |
| 2025 | Antigua | NOIR Antigua 2025 | 978 | 743 | Jul 20 – Nov 4 2025 | 6.3 GB |
| 2026 | St. Lucia | NOIR St. Lucia 2026 | 328 | 847 | Jun 13 – Aug 26 2026 | 8.7 GB |

Counts are as of November 2026. Contributors are mainly PXL Booth (the photo
booth), Carnisa Allen and Eazy A. No items have captions.

## Working with the albums

```sh
# links.txt: one shared-album URL per line, kept outside the repo
python3 scripts/album_catalog.py links.txt /tmp/noir-albums
python3 scripts/album_catalog.py links.txt /tmp/noir-albums --download videos --limit 20
```

- Videos are only available as 720p (720×1280) web copies, already vertical
  (9:16), so they suit Reels/TikTok without cropping. The original 4K/1080p
  files aren't reachable through a shared album.
- Don't commit downloaded media or catalogs to this repo; `.gitignore`
  excludes `content/cache/` if you keep them there.
- The cloud session's network policy must allow `*.icloud.com` and
  `*.icloud-content.com`.
