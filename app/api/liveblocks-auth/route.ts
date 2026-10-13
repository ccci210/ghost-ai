import { currentUser } from "@clerk/nextjs/server";

import { readJsonObject } from "@/lib/api/project-request";
import { getLiveblocks } from "@/lib/liveblocks";
import { getCurrentClerkIdentity, getProjectAccess } from "@/lib/project-access";
import { getUserColor } from "@/lib/user-color";

export async function POST(request: Request) {
  try {
    const identity = await getCurrentClerkIdentity();

    if (!identity) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await readJsonObject(request);
    const room = body?.room;

    // Liveblocks sends { room }; reject wildcards to grant only this room.
    if (typeof room !== "string" || !room.trim() || room.length > 128 || room.includes("*")) {
      return Response.json({ error: "A valid project room ID is required" }, { status: 400 });
    }

    const access = await getProjectAccess(room, identity);

    if (!access.project || !access.hasAccess) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await currentUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const liveblocks = getLiveblocks();
    await liveblocks.getOrCreateRoom(room, {
      defaultAccesses: [],
    });

    const session = liveblocks.prepareSession(identity.userId, {
      userInfo: {
        name: user.fullName || user.username || identity.primaryEmail || "Collaborator",
        avatar: user.imageUrl,
        color: getUserColor(identity.userId),
      },
    });

    session.allow(room, session.FULL_ACCESS);
    const { body: token, status } = await session.authorize();

    return new Response(token, {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Unable to authorize Liveblocks session", error);
    return Response.json({ error: "Unable to authorize Liveblocks session" }, { status: 500 });
  }
}
