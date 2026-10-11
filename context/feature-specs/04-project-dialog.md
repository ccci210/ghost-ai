## Goal

Build the `/editor` home screen and add project dialogs/sidebar actions. No API calls or persistence yet.

## Editor Home

Reuse the existing editor layout. Do not modify the navbar or sidebar behavior.

In the center of the page, add:

- heading: `Create a project or open an existing one`
- description: `Start a new architecture workspace, or choose a project from the sidecar`
- `New project` button with a `Plus` icon

Keep the layout minimal. Do not wrap this content in cards

Clicking `New project` should open the create project dialog

## Dialogs

### Create project

- project name input
- live slug preview based on the name
- preview updates as the user types

### Rename project

- prefilled project name input
- current project name shown in the description
- input auto-focuese
- enter submits

### Delete project

- destructive confirmation only
- no input
- confirm button uses destructive styling

## sidebar

Add project item actions:

- rename
- delete

show actions only for owened projects

- rename
- delete

show actions only for owned projects

hide actions for shared/collaboration projects

on mobile

- tapping outside for the sidebar closes it
- add a backdrop scrim

## sidebar implementation

Create a dedicated hook to manage:

- dialog state
- form state
- loading state

Wire

- editor home `New Project` -> create dialog
- sidebar create -> create dialog
- sidebar rename -> rename dialog
- sidebar delete -> delete dialog

use mock project data only. Do not add API calls or persistence

## Check when done

- sidebar actions are wired
- slug preview works
- no typescript error
- no lint errors
