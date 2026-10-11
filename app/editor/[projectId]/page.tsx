import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEditorProjects } from "@/lib/project-data";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-5xl flex-col px-6 py-12">
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </section>
      }
    >
      <ProjectWorkspaceContent params={params} />
    </Suspense>
  );
}

async function ProjectWorkspaceContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [{ projectId }, { ownedProjects, sharedProjects }] = await Promise.all([
    params,
    getEditorProjects(),
  ]);
  const project = [...ownedProjects, ...sharedProjects].find(
    (item) => item.id === projectId,
  );

  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-5xl flex-col px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your workspace is ready.</p>
    </section>
  );
}
