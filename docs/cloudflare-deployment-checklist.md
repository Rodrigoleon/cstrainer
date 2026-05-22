# Cloudflare Deployment Checklist

This app is already configured for TanStack Start on Cloudflare Workers. The first deployment can use Cloudflare's free Workers plan and the automatic `workers.dev` URL, so no custom domain is required.

## Current Repo Setup

- [x] TanStack Start is installed through `@tanstack/react-start`.
- [x] Cloudflare's TanStack/Vite integration is installed through `@cloudflare/vite-plugin`.
- [x] Wrangler is installed locally as a dev dependency.
- [x] `vite.config.ts` includes `cloudflare({ viteEnvironment: { name: "ssr" } })`.
- [x] `wrangler.jsonc` points Wrangler at `@tanstack/react-start/server-entry`.
- [x] `package.json` has `build`, `preview`, and `deploy` scripts.
- [x] The app builds to `dist/client` and `dist/server`.
- [x] The app currently stores study progress in browser local storage, so no production database is required for v1.

## One-Time Cloudflare Account Setup

- [ ] Create or log into a Cloudflare account.
- [ ] In the Cloudflare dashboard, confirm Workers & Pages is available on the account.
- [ ] Choose a free `workers.dev` subdomain when Cloudflare prompts for one. This is the account-level subdomain used for URLs like `https://cstrainer.<your-subdomain>.workers.dev`.
- [ ] Stay on the Workers Free plan unless a project needs paid limits.

## Local Machine Setup

- [ ] From this repo, authenticate Wrangler:

```bash
npx wrangler login
```

- [ ] Confirm Wrangler can see the account:

```bash
npx wrangler whoami
```

- [ ] Run local verification:

```bash
npm run check
npm run test
npm run build
```

## First Deployment

- [ ] Deploy from the repo:

```bash
npm run deploy
```

- [ ] Copy the deployment URL from Wrangler output. It should be a Cloudflare URL under `workers.dev`.
- [ ] Open the URL and verify:
  - [ ] The trainer loads.
  - [ ] Refreshing the page works.
  - [ ] Random drill selection works.
  - [ ] Code drills execute in the browser.
  - [ ] Progress persists after refresh.

## Keep It Free

- [ ] Avoid adding a paid Cloudflare product until the app needs it.
- [ ] Keep the v1 app database-free because progress is browser-local.
- [ ] Watch Workers usage in the Cloudflare dashboard.
- [ ] If adding stored user data later, prefer Cloudflare D1 for small relational data.
- [ ] If adding uploaded photos later, prefer R2 Standard storage first; avoid Cloudflare Images storage unless you deliberately choose the paid Images plan.
- [ ] If adding image resizing later, use Cloudflare Images transformations against R2-hosted originals and track the monthly transformation limit.

## Future Cloudflare Building Blocks

- Hosting React SSR apps: Cloudflare Workers with Wrangler, as this app uses now.
- Static/client-only apps: Cloudflare Pages can be simpler, but Workers also works.
- Relational app data: D1.
- Blob/photo/file storage: R2 Standard storage.
- Key-value config, cache, or lightweight session-like data: Workers KV.
- Per-user or real-time state coordination: Durable Objects, but review pricing and limits before relying on them.
- Background queues: Cloudflare Queues.
- Image optimization: Cloudflare Images transformations, usually backed by R2 for original storage.

## Notes For This Repo

- `src/db/*` and `drizzle.config.ts` are scaffolding only right now. They use Postgres and are not imported by the current app.
- The app can deploy without setting `DATABASE_URL`.
- The current Worker name is `cstrainer`, so the default URL will be based on that name plus your account's `workers.dev` subdomain.
- Wrangler may print a log-file warning in restricted local environments, but a successful `npm run build` still exits with code 0 and produces the required client and server bundles.
