"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogContext } from "@/components/editor/project-dialog-context"
import { ProjectDialogManager } from "@/components/editor/project-dialog-manager"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

type EditorLayoutProps = {
  children: React.ReactNode
}

export function EditorLayout({ children }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const projectDialogs = useProjectDialogs()

  return (
    <>
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDeleteProject={projectDialogs.openDeleteDialog}
        onNewProject={projectDialogs.openCreateDialog}
        onRenameProject={projectDialogs.openRenameDialog}
        projects={projectDialogs.projects}
        sharedProjects={projectDialogs.sharedProjects}
      />
      <ProjectDialogContext.Provider value={{ openCreateDialog: projectDialogs.openCreateDialog }}>
        <main className="min-h-screen flex-1 pt-14">{children}</main>
      </ProjectDialogContext.Provider>
      <ProjectDialogManager controller={projectDialogs} />
    </>
  )
}
