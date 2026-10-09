Clerk is alrady installed and connected. Wire it into the next.js app: provider, auth pages, redirects, route protection, and user menu

## Design

Use clerk's `dark` theme from `@clerk/ui/themes` as the base

Override clerk appearance variables using app's exisitng css variables. Do not hardcode colors

### Sign-in and sign-up pages

- Large screens: simple two-panel layout
- Left: compact logo, tagline, short text-only feature list
- Right: centered clerk form
- small scrrens:
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layouts

Kepp the layout minimal and professional

## Implementation

Wrap the root layout with `CleakProvider` using clerk's `dark` theme

Create sign-in and signup pages using Clerk components

Use `proxy.ts` at the project root not `middleware.ts`. (I already created the proxy.ts file)

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:

- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

Add Clerk's built-in `UserButton` to the editor navbar right section for profile settings and logout

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customioze clerk internals

Use existing clerk env vars. Do not rename or invent new ones

## Dependencies

install: @clerk/ui

## Check when done

- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use css variables with no hardcoded colors
- `ClerkProvider` wraps the root layout
- `npm run build` passes
