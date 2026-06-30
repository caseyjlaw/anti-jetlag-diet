# Anti-Jetlag Diet

Interactive calculator and reference site for the [Argonne Anti-Jet-Lag Diet](https://www.netlib.org/misc/jet-lag-diet), deployed at:

**https://caseyjlaw.github.io/anti-jetlag-diet/**

## Features

- Enter departure and arrival airports plus local departure/arrival times from your reservation email
- Generates a 4-day feast/fast/travel plan ending with a fast on your departure day
- Calendar highlights meals, caffeine windows, and destination breakfast (07:00 local)
- Educational content adapted from public sources (see Sources below)

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages via `.github/workflows/deploy.yml`.

Enable **Settings → Pages → Source: GitHub Actions** on the repository.

## Sources

This site is an unofficial educational recreation. Content is adapted from:

| Source | URL |
|--------|-----|
| Netlib — Argonne Anti-Jet-Lag Diet | https://www.netlib.org/misc/jet-lag-diet |
| AntiJetLagDiet.com FAQs (archived) | https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/faqs.asp |
| AntiJetLagDiet.com homepage (archived) | https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/ |
| Argonne National Laboratory | https://www.anl.gov/ |
| Military Medicine study (PDF, archived) | https://web.archive.org/web/20130109121752/http://www.antijetlagdiet.com/docs/mmarticle.pdf |

Not affiliated with Argonne National Laboratory or AntiJetLagDiet.com LLC.

## License

Site code: MIT (see package.json). Diet text is adapted from publicly available Argonne / Netlib materials; refer to original sources for authoritative guidance.
