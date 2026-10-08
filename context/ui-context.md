# UI Context

## Theme

Dark only. The root layout applies the `dark` class, and the base CSS tokens use the dark neutral shadcn palette so light defaults do not appear.

## Colors

| Role            | CSS Variable       | Value                         |
| --------------- | ------------------ | ----------------------------- |
| Page background | `--background`     | `oklch(0.145 0 0)`            |
| Surface         | `--card`           | `oklch(0.205 0 0)`            |
| Primary text    | `--foreground`     | `oklch(0.985 0 0)`            |
| Muted text      | `--muted-foreground` | `oklch(0.708 0 0)`          |
| Primary accent  | `--primary`        | `oklch(0.922 0 0)`            |
| Border          | `--border`         | `oklch(1 0 0 / 10%)`          |
| Error           | `--destructive`    | `oklch(0.704 0.191 22.216)`   |
| Success         | —                  | Not defined in this feature   |

## Typography

| Role      | Font      | Variable           |
| --------- | --------- | ------------------ |
| UI text   | Geist Sans | `--font-geist-sans` |
| Code/mono | Geist Mono | `--font-geist-mono` |

## Border Radius

| Context           | Class      |
| ----------------- | ---------- |
| Inline / small UI | `rounded-md` |
| Cards / panels    | `rounded-lg` |
| Modals / overlays | `rounded-xl` |

The base radius token is `--radius: 0.625rem`; generated component classes derive their radii from it.

## Component Library

shadcn/ui using the Base UI primitives and Tailwind CSS v4. Generated components live in `components/ui/`; add or update them through the shadcn CLI and do not edit generated files manually.

## Layout Patterns

- No application layout patterns are defined in this design-system unit.

## Icons

Lucide React. Use `size-4` for inline icons and `size-5` for button icons unless a component specifies another size.
