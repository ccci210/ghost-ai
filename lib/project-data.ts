import "server-only";

import { prisma } from "@/lib/prisma";
import {
  getCurrentClerkIdentity,
  type ClerkProjectIdentity,
} from "@/lib/project-access";

export type ProjectItem = {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
};

export async function getEditorProjects(
  identity?: ClerkProjectIdentity | null,
): Promise<{
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}> {
  const currentIdentity =
    identity === undefined ? await getCurrentClerkIdentity() : identity;

  if (!currentIdentity) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const { userId, primaryEmail } = currentIdentity;
  const owned = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const shared = primaryEmail
    ? await prisma.project.findMany({
        where: {
          ownerId: { not: userId },
          collaborators: {
            some: { email: { equals: primaryEmail, mode: "insensitive" } },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return {
    ownedProjects: owned.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.id,
      isOwned: true,
    })),
    sharedProjects: shared.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.id,
      isOwned: false,
    })),
  };
}
