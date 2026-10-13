"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { PanelRightClose, PanelRightOpen, Share2 } from "lucide-react";

import { EditorCanvas } from "@/components/editor/editor-canvas";
import { ProjectDialogManager } from "@/components/editor/project-dialog-manager";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectItem } from "@/lib/project-data";

type WorkspaceProject = {
  id: string;
  name: string;
  isOwned: boolean;
};

type WorkspaceLayoutProps = {
  project: WorkspaceProject;
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
};

export function WorkspaceLayout({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceLayoutProps) {
  const router = useRouter();
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const projectActions = useProjectActions(ownedProjects, sharedProjects);

  return (
    <div className="fixed inset-0 z-30 flex h-dvh flex-col overflow-hidden bg-background">
      <header className="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span aria-hidden="true" className="size-3 shrink-0 rounded-sm bg-auth-accent" />
          <h1 className="truncate text-sm font-semibold sm:text-base">{project.name}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            aria-label="Share project"
            onClick={() => setIsShareDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Share2 />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            aria-expanded={isAiSidebarOpen}
            aria-label={isAiSidebarOpen ? "Hide AI sidebar" : "Show AI sidebar"}
            onClick={() => setIsAiSidebarOpen((open) => !open)}
            size="icon"
            title={isAiSidebarOpen ? "Hide AI sidebar" : "Show AI sidebar"}
            variant="ghost"
          >
            {isAiSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ProjectSidebar
          activeProjectId={project.id}
          isOpen
          onClose={() => {}}
          onDeleteProject={projectActions.openDeleteDialog}
          onNewProject={projectActions.openCreateDialog}
          onOpenProject={(item) => router.push(`/editor/${encodeURIComponent(item.id)}`)}
          onRenameProject={projectActions.openRenameDialog}
          projects={projectActions.ownedProjects}
          sharedProjects={projectActions.sharedProjects}
          variant="docked"
        />

        <main aria-label="Project canvas" className="relative min-w-0 flex-1 overflow-hidden bg-[#090b0f]">
          <EditorCanvas roomId={project.id} />
        </main>

        {isAiSidebarOpen ? (
          <aside
            aria-label="AI assistant"
            className="hidden w-72 shrink-0 flex-col border-l border-border bg-card/60 p-4 md:flex xl:w-80"
          >
            <h2 className="text-sm font-semibold">AI assistant</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AI project assistance will be available here.
            </p>
          </aside>
        ) : null}
      </div>

      <ProjectDialogManager controller={projectActions} />
      <ShareDialog
        isOwner={project.isOwned}
        onOpenChange={setIsShareDialogOpen}
        open={isShareDialogOpen}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
}
