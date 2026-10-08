"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
  onNewProject?: () => void
}

export function ProjectSidebar({ isOpen, onClose, onNewProject }: ProjectSidebarProps) {
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
          <TabsContent className="flex items-center justify-center" value="my-projects">
            <p className="text-sm text-muted-foreground">Your projects will appear here.</p>
          </TabsContent>
          <TabsContent className="flex items-center justify-center" value="shared">
            <p className="text-sm text-muted-foreground">Projects shared with you will appear here.</p>
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
