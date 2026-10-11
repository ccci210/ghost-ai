Prisma is already installed. Add the project data models. Prisma client singleton, add first migration

## Models

Create `prisma/models/project.prisma`

Add `Project`:

- owner ID mapped to Clerk user
- name
- optional description
- status enum: `Draft`, `Archived`
- `canvasJsonPath` for future canvas blob storage
- timestamps
- indexes on owner ID and creation date

Add `projectCollaborator`:

- project relation with cascade delete
- collaborator email
- creation timestamp
- unique constraint on project/email
- indexes on email and project/data

Do not add extra fields unless required by Prisma

## Prisma client

create `lib/prisma.ts` as a cached singleton

Use accelerate as it starts with `prisma+postgres://`

Cache the client on `global` in development for hot reloads

## Migration

Run the migration and generate the client

## Check when done

- schema has both models with correct relations and indexes
- `lib/prisma/ts` exports one cached Prisma instance
- migration runs successfully
- `npm run build` passes
