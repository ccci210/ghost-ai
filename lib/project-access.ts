import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ClerkProjectIdentity = {
  userId: string;
  primaryEmail: string | null;
};

export async function getCurrentClerkIdentity(): Promise<ClerkProjectIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  return {
    userId,
    primaryEmail: user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null,
  };
}

export async function getProjectAccess(
  roomId: string,
  identity: ClerkProjectIdentity,
) {
  const project = await prisma.project.findUnique({
    where: { id: roomId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) {
    return { project: null, isOwner: false, hasAccess: false };
  }

  const isOwner = project.ownerId === identity.userId;

  if (isOwner) {
    return {
      project: { id: project.id, name: project.name },
      isOwner: true,
      hasAccess: true,
    };
  }

  const collaborator = identity.primaryEmail
    ? await prisma.projectCollaborator.findFirst({
        where: {
          projectId: roomId,
          email: { equals: identity.primaryEmail, mode: "insensitive" },
        },
        select: { projectId: true },
      })
    : null;

  return {
    project: { id: project.id, name: project.name },
    isOwner: false,
    hasAccess: Boolean(collaborator),
  };
}
