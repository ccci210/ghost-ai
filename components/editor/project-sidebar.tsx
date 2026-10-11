"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProjectItem } from "@/hooks/use-project-dialogs"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
  projects: ProjectItem[]
  sharedProjects: ProjectItem[]
  onNewProject: () => void
  onRenameProject: (project: ProjectItem) => void
  onDeleteProject: (project: ProjectItem) => void
}

function ProjectList({
  projects,
  emptyMessage,
  onRenameProject,
  onDeleteProject,
}: {
  projects: ProjectItem[]
  emptyMessage: string
  onRenameProject?: (project: ProjectItem) => void
  onDeleteProject?: (project: ProjectItem) => void
}) {
  if (projects.length === 0) {
    return <p className="px-2 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-1">
      {projects.map((project) => (
        <li className="group flex items-center gap-2 rounded-md px-2 py-2 hover:bg-sidebar-accent" key={project.id}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{project.name}</p>
            <p className="truncate text-xs text-muted-foreground">/{project.slug}</p>
          </div>
          {project.isOwned && onRenameProject && onDeleteProject ? (
            <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <Button
                aria-label={`Rename ${project.name}`}
                onClick={() => onRenameProject(project)}
                size="icon-sm"
                title={`Rename ${project.name}`}
                variant="ghost"
              >
                <Pencil />
              </Button>
              <Button
                aria-label={`Delete ${project.name}`}
                onClick={() => onDeleteProject(project)}
                size="icon-sm"
                title={`Delete ${project.name}`}
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  sharedProjects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      <button
        aria-label="Close projects sidebar"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-label="Projects"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        inert={!isOpen}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <h2 className="text-sm font-semibold">Projects</h2>
          <Button aria-label="Close projects sidebar" onClick={onClose} size="icon" variant="ghost">
            <X />
          </Button>
        </div>

        <Tabs className="flex min-h-0 flex-1 flex-col gap-4 p-4" defaultValue="my-projects">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent className="min-h-0 overflow-y-auto" value="my-projects">
            <ProjectList
              emptyMessage="Your projects will appear here."
              onDeleteProject={onDeleteProject}
              onRenameProject={onRenameProject}
              projects={projects}
            />
          </TabsContent>
          <TabsContent className="min-h-0 overflow-y-auto" value="shared">
            <ProjectList emptyMessage="Projects shared with you will appear here." projects={sharedProjects} />
          </TabsContent>
        </Tabs>

        <div className="border-t border-sidebar-border p-4">
          <Button className="w-full" onClick={onNewProject}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
