import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { parseProjectName, readJsonObject } from "@/lib/api/project-request";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ projects });
  } catch {
    return Response.json({ error: "Unable to list projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonObject(request);

  if (!body) {
    return Response.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  const name = parseProjectName(body.name, true);

  if (!name) {
    return Response.json({ error: "Project name must be a non-empty string" }, { status: 400 });
  }

  const id = body.id;
  if (id !== undefined && (typeof id !== "string" || !id.trim() || id.length > 128)) {
    return Response.json({ error: "Project ID must be a non-empty string up to 128 characters" }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: { ...(typeof id === "string" ? { id: id.trim() } : {}), ownerId: userId, name },
    });

    return Response.json({ project }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to create project" }, { status: 500 });
  }
}
