import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceLayout } from "@/components/editor/workspace-layout";
import { getEditorProjects } from "@/lib/project-data";
import {
  getCurrentClerkIdentity,
  getProjectAccess,
} from "@/lib/project-access";

type WorkspacePageProps = {
  params: Promise<{ roomId: string }>;
};

export default function WorkspacePage({ params }: WorkspacePageProps) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
          Loading workspace…
        </main>
      }
    >
      <WorkspacePageContent params={params} />
    </Suspense>
  );
}

async function WorkspacePageContent({ params }: WorkspacePageProps) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const access = await getProjectAccess(roomId, identity);

  if (!access.project || !access.hasAccess) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getEditorProjects(identity);

  return (
    <WorkspaceLayout
      ownedProjects={ownedProjects}
      project={{ ...access.project, isOwned: access.isOwner }}
      sharedProjects={sharedProjects}
    />
  );
}
