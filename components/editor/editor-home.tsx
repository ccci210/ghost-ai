"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProjectDialogContext } from "@/components/editor/project-dialog-context"

export function EditorHome() {
  const { openCreateDialog } = useProjectDialogContext()

  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Create a project or open an existing one
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
        Start a new architecture workspace, or choose a project from the sidecar
      </p>
      <Button className="mt-8" onClick={openCreateDialog}>
        <Plus />
        New project
      </Button>
    </section>
  )
}
