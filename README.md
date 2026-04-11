# inimi.dev

Personal site and app for Inimi, built with Next.js 16, React 19, Tailwind CSS, and HeroUI.

The site includes a public home page, bio/contact pages, authorization screens, a custom 404 flow, and a few API/WebSocket routes that support the broader app. The homepage now loads GitHub repositories and latest commits on the client side so the shell stays fast and resilient when the GitHub API is rate limited.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- HeroUI
- Clerk
- WebSocket and API route support for the app's service integrations

## Development

Install dependencies and start the dev server:

```bash
bun install
bun run dev
```

Other useful scripts:

```bash
bun run build
bun run start
bun run lint
```

## Routes

Public pages live under `/www`:

- `/www` - homepage with hero content and latest GitHub projects
- `/www/about` - biography page
- `/www/contact` - contact details and local time
- `/www/code` - authorization code page
- `/www/iris` - IRIS authorization page
- `/www/not-found` - styled 404 page for the `/www` section

Application-level routes and handlers include:

- `/api/v1/age/live`
- `/api/v1/oauth/callback`
- `/api/v1/age/img`
- `/api/v1/age/json`
- `/ws/bot/[UUID]`

## Notes

- The UI uses a local class-based theme toggle instead of a runtime theme provider.
- The `/www` catch-all route exists so segment misses resolve to the styled not-found page.
- GitHub repo and commit fetching is handled in the browser with official `fetch` caching options.
- Some endpoint paths depend on the environment and are hardcoded for local development versus production in the route handlers.

## Project structure

- `src/app` - routes, layouts, and route handlers
- `src/components` - shared UI
- `src/utils` - app utilities and service helpers
- `src/styles` - global styles
- `tools` - maintenance scripts
