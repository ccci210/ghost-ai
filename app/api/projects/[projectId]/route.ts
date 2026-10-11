import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { parseProjectName, readJsonObject } from "@/lib/api/project-request";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function PATCH(request: Request, { params }: ProjectRouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonObject(request);

  if (!body) {
    return Response.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  const name = parseProjectName(body.name);

  if (!name) {
    return Response.json({ error: "Project name must be a non-empty string" }, { status: 400 });
  }

  const { projectId } = await params;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!existingProject) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.ownerId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await prisma.project.update({
      where: { id: projectId, ownerId: userId },
      data: { name },
    });

    return Response.json({ project });
  } catch {
    return Response.json({ error: "Unable to rename project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: ProjectRouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!existingProject) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.ownerId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id: projectId, ownerId: userId },
    });

    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Unable to delete project" }, { status: 500 });
  }
}
