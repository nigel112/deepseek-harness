# Live stock provenance

The eleven vehicles added to `src/data.js` come from PanJap Motors' own public
social posts and its live online inventory. Every record carries a `source`
object (`channel`, `date`, `url`) which is surfaced on the stock card, in the
quick-view modal, in the no-JS fallback and as `subjectOf` in JSON-LD.

Research date: **4 November 2026** (Africa/Harare).

## X / Twitter — [@Panjapmotorszim](https://x.com/Panjapmotorszim)

| Date (2026) | Vehicle | Price | Mileage | Post |
| --- | --- | --- | --- | --- |
| 03 Nov | 2025 Lexus GX550 | $198,000 | not stated | [2117559372041650559](https://x.com/Panjapmotorszim/status/2117559372041650559) |
| 03 Nov | 2025 Mercedes-Benz G450d | POA | not stated | [2117555341193773447](https://x.com/Panjapmotorszim/status/2117555341193773447) |
| 02 Nov | 2024 Toyota Land Cruiser Prado | $125,000 | 800 km | [2117165085374439820](https://x.com/Panjapmotorszim/status/2117165085374439820) |
| 30 Oct | 2022 Range Rover Sport HSE | $163,000 | 37,000 km | [2116297023716463035](https://x.com/Panjapmotorszim/status/2116297023716463035) |
| 29 Oct | 2022 Range Rover Sport HSE | $168,000 | 12,000 km | [2115679162979758170](https://x.com/Panjapmotorszim/status/2115679162979758170) |

Specs in `src/data.js` are transcribed from these posts (engine, seats,
sunroof, audio, driver assists). The G450d post explicitly says **POA**, so its
price is `null` and the UI renders `POA` instead of inventing a number.

## TikTok — [@panjap.motors1](https://www.tiktok.com/@panjap.motors1)

| Date (2026) | Vehicle | Source |
| --- | --- | --- |
| 28 Sep | 2019 Porsche Cayenne, Java Green | [TikTok discovery: Green Porsche Cayenne](https://www.tiktok.com/discover/green-porsche-cayenne-lifted) |
| 27 Jul | BMW X6M (V8 Breakfast Meet coverage) | [TikTok discovery: Brighton Panjap Motors](https://www.tiktok.com/discover/brighton-panjap-motors-zimbabwe) |
| 27 Jul | Riddara RD6 all-electric pickup | [TikTok discovery: Brighton Panjap Motors](https://www.tiktok.com/discover/brighton-panjap-motors-zimbabwe) |

These posts do not state price, mileage or model year, so those fields are
`null` / `Enquire` / "On application" rather than guessed.

## Live inventory — [panjapmotorszim.com/vehicles](https://panjapmotorszim.com/vehicles)

| Vehicle | Price | Mileage |
| --- | --- | --- |
| 2024 Lexus LX600 | $225,000 | 715 km |
| 2024 Land Rover Range Rover Autobiography | $285,000 | 1,300 km |
| 2022 Land Rover Defender D300 | $125,000 | 22,991 km |

## Refreshing

This is a point-in-time snapshot, not a live feed — no social API credentials
are used. To refresh, re-read the channels above and edit `socialVehicles` in
`src/data.js`; the stock grid, runway, quick view, JSON-LD `ItemList` and image
sitemap derive from that array. Update the no-JavaScript stock list in
`index.html` separately.

## Imagery

The plates in `public/assets/*.jpg` and the transparent cutouts in
`public/assets/cars/*.webp` are **AI-generated concept renders** of the named
models, not photographs of the actual vehicles. They are derived from one
white-background render per car: a border-connected cutout produces the WebP
with alpha, and the same cutout is composited onto the dark light-tunnel plate.
Brand names and trademarks belong to their respective owners.
