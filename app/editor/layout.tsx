import type { ReactNode } from "react";
import { Suspense } from "react";

import { EditorLayout } from "@/components/editor/editor-layout";
import { getEditorProjects } from "@/lib/project-data";

export default function EditorRouteLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<EditorLayout ownedProjects={[]} sharedProjects={[]}>{children}</EditorLayout>}>
      <EditorProjectsLayout>{children}</EditorProjectsLayout>
    </Suspense>
  );
}

async function EditorProjectsLayout({ children }: { children: ReactNode }) {
  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return (
    <EditorLayout ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      {children}
    </EditorLayout>
  );
}
