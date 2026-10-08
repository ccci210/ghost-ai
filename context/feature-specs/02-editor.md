We need the base chrome components that frame every editor screen - the top navbar and the left shdebar shell. These will be reused and extended in every chapter that follows

### Editor navbar

Create `components/editor/editor-navbar.tsx`

Requirements:

- Fixed-height top navbar
- left, center, and right sections
- left section contains sidebar toggle button
- Use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state
- right section stays empty for now
- dark background with subtle bottom border

### Project Sidebar

Create `components/editor/editor-navbar.tsx`

Requirements:

- sidebar should float above the editor canvas
- opening it should not push page content
- slides in from the left
- accepts `isOpen` prop and `onClose` prop
- header with `Projects` title + close button
- shadcn `Tabs`:
  - My projects
  - Shared
- both tabs show empty placeholder state
- full- width `New Project` button at the bottom with `Plus` icon

### Dialog pattern

use the existing color tokens from `global.css` for dialog styling

Support:

- title
- description
- footer actions

Do not build actual dislogs yet

### Check when donw

- new components compile without Typescript errors
- no lint errors
- dialog patter nis ready for future use
