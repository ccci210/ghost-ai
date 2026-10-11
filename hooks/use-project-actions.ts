"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ProjectItem } from "@/lib/project-data";

export type ProjectDialogKind = "create" | "rename" | "delete" | null;

export function createProjectSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createShortSuffix() {
  return globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 8);
}

function createRoomId(name: string, suffix: string) {
  const slug = createProjectSlug(name).slice(0, 48).replace(/-+$/g, "") || "untitled-project";
  return `${slug}-${suffix}`;
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "error" in body) {
      const error = body.error;
      if (typeof error === "string") return error;
    }
  } catch {
    // Keep the generic message when the API does not return JSON.
  }

  return fallback;
}

export function useProjectActions(
  ownedProjects: ProjectItem[],
  sharedProjects: ProjectItem[],
) {
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<ProjectDialogKind>(null);
  const [projectName, setProjectName] = useState("");
  const [projectSuffix, setProjectSuffix] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOwnedProjects, setCurrentOwnedProjects] = useState(ownedProjects);
  const [currentSharedProjects, setCurrentSharedProjects] = useState(sharedProjects);
  const slugPreview = useMemo(() => createProjectSlug(projectName), [projectName]);
  const roomIdPreview = createRoomId(projectName, projectSuffix || "xxxxxxxx");

  useEffect(() => {
    setCurrentOwnedProjects(ownedProjects);
    setCurrentSharedProjects(sharedProjects);
  }, [ownedProjects, sharedProjects]);

  function resetDialog() {
    setActiveDialog(null);
    setProjectName("");
    setProjectSuffix("");
    setSelectedProject(null);
    setError(null);
  }

  function closeDialog() {
    if (!isLoading) resetDialog();
  }

  function openCreateDialog() {
    setProjectName("");
    setProjectSuffix(createShortSuffix());
    setSelectedProject(null);
    setError(null);
    setActiveDialog("create");
  }

  function openRenameDialog(project: ProjectItem) {
    if (!project.isOwned) return;
    setSelectedProject(project);
    setProjectName(project.name);
    setError(null);
    setActiveDialog("rename");
  }

  function openDeleteDialog(project: ProjectItem) {
    if (!project.isOwned) return;
    setSelectedProject(project);
    setProjectName("");
    setError(null);
    setActiveDialog("delete");
  }

  async function createProject() {
    const name = projectName.trim();
    if (!name || !slugPreview) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomIdPreview, name }),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response, "Unable to create project."));
        return;
      }

      const { project } = (await response.json()) as {
        project: { id: string; name: string };
      };

      setCurrentOwnedProjects((current) => [
        { id: project.id, name: project.name, slug: project.id, isOwned: true },
        ...current,
      ]);
      resetDialog();
      router.push(`/editor/${encodeURIComponent(project.id)}`);
    } catch {
      setError("Unable to create project. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function renameProject() {
    const name = projectName.trim();
    if (!selectedProject || !name || !slugPreview) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedProject.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) {
        setError(await getErrorMessage(response, "Unable to rename project."));
        return;
      }

      setCurrentOwnedProjects((current) =>
        current.map((project) =>
          project.id === selectedProject.id ? { ...project, name } : project,
        ),
      );
      resetDialog();
      router.refresh();
    } catch {
      setError("Unable to rename project. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProject() {
    if (!selectedProject?.isOwned) return;

    const projectId = selectedProject.id;
    const projectPath = `/editor/${encodeURIComponent(projectId)}`;
    const pathname = window.location.pathname;
    const deletingActiveProject =
      pathname === projectPath || pathname.startsWith(`${projectPath}/`);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError(await getErrorMessage(response, "Unable to delete project."));
        return;
      }

      setCurrentOwnedProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
      resetDialog();
      if (deletingActiveProject) {
        router.replace("/editor");
      }
      router.refresh();
    } catch {
      setError("Unable to delete project. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    activeDialog,
    closeDialog,
    createProject,
    deleteProject,
    error,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    ownedProjects: currentOwnedProjects,
    projectName,
    renameProject,
    roomIdPreview,
    selectedProject,
    setProjectName,
    sharedProjects: currentSharedProjects,
    slugPreview,
  };
}
