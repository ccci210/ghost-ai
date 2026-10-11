"use client"

import { useMemo, useState } from "react"

export type ProjectItem = {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export type ProjectDialogKind = "create" | "rename" | "delete" | null

const initialOwnedProjects: ProjectItem[] = [
  { id: "platform-blueprint", name: "Platform Blueprint", slug: "platform-blueprint", isOwned: true },
  { id: "mobile-app", name: "Mobile App", slug: "mobile-app", isOwned: true },
]

const sharedProjects: ProjectItem[] = [
  { id: "design-system", name: "Design System", slug: "design-system", isOwned: false },
]

export function createProjectSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function mockRequest() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 180))
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState(initialOwnedProjects)
  const [activeDialog, setActiveDialog] = useState<ProjectDialogKind>(null)
  const [projectName, setProjectName] = useState("")
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const slugPreview = useMemo(() => createProjectSlug(projectName), [projectName])

  function closeDialog() {
    if (isLoading) return
    setActiveDialog(null)
    setProjectName("")
    setSelectedProject(null)
  }

  function openCreateDialog() {
    setProjectName("")
    setSelectedProject(null)
    setActiveDialog("create")
  }

  function openRenameDialog(project: ProjectItem) {
    if (!project.isOwned) return
    setSelectedProject(project)
    setProjectName(project.name)
    setActiveDialog("rename")
  }

  function openDeleteDialog(project: ProjectItem) {
    if (!project.isOwned) return
    setSelectedProject(project)
    setProjectName("")
    setActiveDialog("delete")
  }

  async function runMockAction(action: () => void) {
    setIsLoading(true)
    await mockRequest()
    action()
    setIsLoading(false)
    setActiveDialog(null)
    setProjectName("")
    setSelectedProject(null)
  }

  async function createProject() {
    const name = projectName.trim()
    const slug = createProjectSlug(name)
    if (!name || !slug) return

    await runMockAction(() => {
      setProjects((current) => [
        { id: `project-${Date.now()}`, name, slug, isOwned: true },
        ...current,
      ])
    })
  }

  async function renameProject() {
    const name = projectName.trim()
    const slug = createProjectSlug(name)
    if (!selectedProject || !name || !slug) return

    await runMockAction(() => {
      setProjects((current) =>
        current.map((project) =>
          project.id === selectedProject.id ? { ...project, name, slug } : project,
        ),
      )
    })
  }

  async function deleteProject() {
    if (!selectedProject?.isOwned) return

    await runMockAction(() => {
      setProjects((current) => current.filter((project) => project.id !== selectedProject.id))
    })
  }

  return {
    activeDialog,
    closeDialog,
    createProject,
    deleteProject,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    projectName,
    projects,
    renameProject,
    selectedProject,
    setProjectName,
    sharedProjects,
    slugPreview,
  }
}
