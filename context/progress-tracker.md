# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Implement Prisma project and collaborator models, a cached Prisma Client, and the initial database migration from `context/feature-specs/05-prisma.md`.

## Completed

- Added the Prisma `Project` and `ProjectCollaborator` models with Clerk owner IDs, draft/archive status, timestamps, cascade deletion, uniqueness, and query indexes.
- Added the cached Prisma singleton with Prisma Accelerate URL handling and direct PostgreSQL adapter support.
- Updated Prisma configuration to load `.env.local` and discover the multi-file schema.
- Created and applied the initial Prisma migration and generated the Prisma Client.
- Verified with a successful production build.
- Added the minimal editor home heading, description, and New project action without a card wrapper.
- Added `useProjectDialogs` to manage dialog selection, project-name form state, mock loading, and in-memory mock owned/shared projects.
- Wired create actions from the editor home and sidebar, plus owned-project rename/delete actions; shared projects have no actions.
- Added project name entry, live slug preview, rename prefill/autofocus/Enter submit, and destructive delete confirmation.
- Kept the sidebar scrim/outside-close behavior for mobile.
- Verified with `npx tsc --noEmit` and `npm run lint`.
- Wrapped the root app body in `ClerkProvider` using Clerk's dark theme and the app's CSS color tokens.
- Kept Clerk's provider and theme in `components/auth/clerk-app-provider.tsx`, an explicit client boundary shared by auth components.
- Added minimal responsive two-panel sign-in and sign-up pages with text-only product details and Clerk's hosted forms.
- Refined the auth pages to match the supplied reference: Inter typography, exact 50/50 desktop panels, cyan accent tokens, and a differentiated form panel with concise feature rows.
- Updated the root `proxy.ts` to allow the configured sign-in/sign-up paths and protect other matched routes by default.
- Added request-time root redirects: signed-in users go to `/editor`, signed-out users go to the configured sign-in path.
- Added the editor route and moved the editor shell to its nested layout; the navbar uses Clerk's built-in `UserButton`.
- Verified the implementation with a successful `npm run build`.
- Verified the auth visual refresh with a successful `npm run build`.
- Removed the auth accent override for Clerk's neutral palette so social-provider button labels use the dark theme's readable neutral colors.
- Composed the editor navbar and floating project sidebar in `components/editor/editor-layout.tsx`, mounted around the `/editor` route from its nested layout.
- Initialized shadcn/ui for Next.js and Tailwind CSS v4 with `components.json`.
- Added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea under `components/ui/`.
- Installed Lucide React and the class-merging `cn` utility.
- Set the root layout and global theme tokens to dark by default.
- Documented the active UI palette and conventions in `ui-context.md`.
- Verified with a successful Webpack production build and a class-merging check.

## In Progress

- None.

## Next Up

- No next feature unit specified.

## Open Questions

- The spec repeats the navbar path for the Project Sidebar. Implemented it as `components/editor/project-sidebar.tsx` to keep the components separate.
- Clerk production credentials are not configured; this feature currently uses the connected development instance.

## Architecture Decisions

- Use the shadcn/ui Base UI preset with Tailwind CSS v4; this is the generated configuration for the installed component set.
- Apply a dark-only neutral palette by default because the feature requires no light styling and no existing palette values were present in `globals.css`.

## Session Notes

- Prisma 7.10 CLI and client require Node 20.19+, 22.12+, or 24+; the workspace's Node 21.7.2 runtime was unsupported, so Prisma commands and the production build ran under a temporary Node 22 runtime.
- Generated files in `components/ui/` were not edited after installation.
- The Turbopack build could not spawn its CSS worker in this environment. `npm run build -- --webpack` completed successfully.
- Implemented `EditorNavbar`, `ProjectSidebar`, and `EditorDialogPattern` in `components/editor/`.
- `npm run lint` and `npx tsc --noEmit` both completed successfully for the editor feature.
- The `/editor` layout displays the navbar and sidebar; lint and TypeScript checks passed after the editor integration.
- The root redirect reads Clerk session state inside a `Suspense` boundary to satisfy Next.js 16 Cache Components prerendering.
- `npm ls @clerk/shared @clerk/nextjs @clerk/ui` shows a single deduplicated `@clerk/shared@4.39.1`; `npm run build` passes after moving the provider into its client wrapper.
