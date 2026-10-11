"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogContext } from "@/components/editor/project-dialog-context"
import { ProjectDialogManager } from "@/components/editor/project-dialog-manager"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectItem } from "@/lib/project-data"

type EditorLayoutProps = {
  children: React.ReactNode
  ownedProjects: ProjectItem[]
  sharedProjects: ProjectItem[]
}

export function EditorLayout({ children, ownedProjects, sharedProjects }: EditorLayoutProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const projectActions = useProjectActions(ownedProjects, sharedProjects)

  return (
    <>
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDeleteProject={projectActions.openDeleteDialog}
        onNewProject={projectActions.openCreateDialog}
        onOpenProject={(project) => {
          setIsSidebarOpen(false)
          router.push(`/editor/${encodeURIComponent(project.id)}`)
        }}
        onRenameProject={projectActions.openRenameDialog}
        projects={projectActions.ownedProjects}
        sharedProjects={projectActions.sharedProjects}
      />
      <ProjectDialogContext.Provider value={{ openCreateDialog: projectActions.openCreateDialog }}>
        <main className="min-h-screen flex-1 pt-14">{children}</main>
      </ProjectDialogContext.Provider>
      <ProjectDialogManager controller={projectActions} />
    </>
  )
}
