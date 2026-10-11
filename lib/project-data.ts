import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ProjectItem = {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
};

export async function getEditorProjects(): Promise<{
  ownedProjects: ProjectItem[];
  sharedProjects: ProjectItem[];
}> {
  const { userId } = await auth();

  if (!userId) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const [owned, clerkUser] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    currentUser(),
  ]);

  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  const shared = email
    ? await prisma.project.findMany({
        where: {
          ownerId: { not: userId },
          collaborators: {
            some: { email: { equals: email, mode: "insensitive" } },
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
