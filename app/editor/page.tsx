import { Suspense } from "react";

import { EditorLayout } from "@/components/editor/editor-layout";
import { EditorHome } from "@/components/editor/editor-home";
import { getEditorProjects } from "@/lib/project-data";

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <EditorLayout ownedProjects={[]} sharedProjects={[]}>
          <EditorHome />
        </EditorLayout>
      }
    >
      <EditorHomeWithProjects />
    </Suspense>
  );
}

async function EditorHomeWithProjects() {
  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return (
    <EditorLayout ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      <EditorHome />
    </EditorLayout>
  );
}
