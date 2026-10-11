"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern"
import type { useProjectDialogs } from "@/hooks/use-project-dialogs"

type ProjectDialogController = ReturnType<typeof useProjectDialogs>

type ProjectDialogManagerProps = {
  controller: ProjectDialogController
}

export function ProjectDialogManager({ controller }: ProjectDialogManagerProps) {
  const {
    activeDialog,
    closeDialog,
    createProject,
    deleteProject,
    isLoading,
    projectName,
    renameProject,
    selectedProject,
    setProjectName,
    slugPreview,
  } = controller

  const isOpen = activeDialog !== null
  const isCreate = activeDialog === "create"
  const isRename = activeDialog === "rename"
  const isDelete = activeDialog === "delete"
  const isFormValid = projectName.trim().length > 0 && slugPreview.length > 0
  const formId = "project-name-form"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isCreate) await createProject()
    if (isRename) await renameProject()
  }

  return (
    <EditorDialogPattern
      actions={
        <>
          <Button disabled={isLoading} onClick={closeDialog} type="button" variant="outline">
            Cancel
          </Button>
          {isDelete ? (
            <Button disabled={isLoading} onClick={deleteProject} type="button" variant="destructive">
              {isLoading ? "Deleting…" : "Delete project"}
            </Button>
          ) : (
            <Button disabled={isLoading || !isFormValid} form={formId} type="submit">
              {isLoading ? (isCreate ? "Creating…" : "Saving…") : isCreate ? "Create project" : "Save changes"}
            </Button>
          )}
        </>
      }
      description={
        isRename
          ? `Rename “${selectedProject?.name ?? ""}”.`
          : isDelete
            ? `Are you sure you want to delete “${selectedProject?.name ?? ""}”? This action cannot be undone.`
            : "Give your new workspace a name."
      }
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
      open={isOpen}
      title={isCreate ? "Create project" : isRename ? "Rename project" : "Delete project"}
    >
      {isDelete ? null : (
        <form className="space-y-4" id={formId} onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="project-name">
              Project name
            </label>
            <Input
              autoFocus={isRename}
              autoComplete="off"
              disabled={isLoading}
              id="project-name"
              onChange={(event) => setProjectName(event.currentTarget.value)}
              placeholder="e.g. Customer Portal"
              value={projectName}
            />
          </div>
          {isCreate ? (
            <div className="space-y-1" aria-live="polite">
              <p className="text-xs font-medium text-muted-foreground">Project slug</p>
              <p className="rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-sm">
                {slugPreview || "project-name"}
              </p>
            </div>
          ) : null}
        </form>
      )}
    </EditorDialogPattern>
  )
}
