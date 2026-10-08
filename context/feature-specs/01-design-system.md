Read `AGENTS.md` before starting

We are adding the design system and UI components

Install and configure `shadcn/ui`

Add these shadcn components:

- Button
- Card
- Dialog
- Input
- Tabs
- Textarea
- ScrollArea

Do not modify the generated `components/ui/*` files after installation

Also install `lucide-react`

Create `lib/utils.ts` with a reusable `cn()` helper for mergin Tailwind classes

Ensure all components match the existing dark theme in `globals.css`

### Checks when done

- All components import without errors
- `cn()` works properly
- No default light styling appears
