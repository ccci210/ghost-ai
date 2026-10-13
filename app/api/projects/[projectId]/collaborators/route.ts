import { clerkClient } from "@clerk/nextjs/server";

import { readJsonObject } from "@/lib/api/project-request";
import { prisma } from "@/lib/prisma";
import { getCurrentClerkIdentity, getProjectAccess } from "@/lib/project-access";

type RouteContext = { params: Promise<{ projectId: string }> };

async function getAccess(projectId: string) {
  const identity = await getCurrentClerkIdentity();
  if (!identity) return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) };

  const access = await getProjectAccess(projectId, identity);
  if (!access.project || !access.hasAccess) {
    return { response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { isOwner: access.isOwner };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const access = await getAccess(projectId);
  if ("response" in access) return access.response;

  try {
    const rows = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      select: { email: true, createdAt: true },
    });

    const client = await clerkClient();
    const users = rows.length
      ? (await client.users.getUserList({
          emailAddress: rows.map(({ email }) => email),
          limit: Math.min(rows.length, 100),
        })).data
      : [];
    const profiles = new Map<string, { name: string | null; imageUrl: string | null }>();

    for (const user of users) {
      const email = user.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress;
      if (email) {
        profiles.set(email.toLowerCase(), {
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
          imageUrl: user.imageUrl || null,
        });
      }
    }

    return Response.json({
      collaborators: rows.map(({ email, createdAt }) => ({
        email,
        createdAt,
        ...(profiles.get(email.toLowerCase()) ?? { name: null, imageUrl: null }),
      })),
      canManage: access.isOwner,
    });
  } catch {
    return Response.json({ error: "Unable to list collaborators" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const access = await getAccess(projectId);
  if ("response" in access) return access.response;
  if (!access.isOwner) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await readJsonObject(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    const existing = await prisma.projectCollaborator.findFirst({
      where: { projectId, email: { equals: email, mode: "insensitive" } },
      select: { email: true },
    });
    if (existing) return Response.json({ error: "This person already has access" }, { status: 409 });

    const collaborator = await prisma.projectCollaborator.create({
      data: { projectId, email },
      select: { email: true, createdAt: true },
    });
    return Response.json({ collaborator }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to invite collaborator" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const access = await getAccess(projectId);
  if ("response" in access) return access.response;
  if (!access.isOwner) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await readJsonObject(request);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || email.length > 254) {
    return Response.json({ error: "A valid collaborator email is required" }, { status: 400 });
  }

  try {
    const collaborator = await prisma.projectCollaborator.findFirst({
      where: { projectId, email: { equals: email, mode: "insensitive" } },
      select: { email: true },
    });
    if (!collaborator) return Response.json({ error: "Collaborator not found" }, { status: 404 });

    await prisma.projectCollaborator.delete({
      where: { projectId_email: { projectId, email: collaborator.email } },
    });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Unable to remove collaborator" }, { status: 500 });
  }
}
