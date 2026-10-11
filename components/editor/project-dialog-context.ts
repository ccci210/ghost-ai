"use client"

import { createContext, useContext } from "react"

type ProjectDialogContextValue = {
  openCreateDialog: () => void
}

export const ProjectDialogContext = createContext<ProjectDialogContextValue | null>(null)

export function useProjectDialogContext() {
  const context = useContext(ProjectDialogContext)

  if (!context) {
    throw new Error("useProjectDialogContext must be used within the editor layout")
  }

  return context
}
