"use client";

import { Component, useState, type ReactNode } from "react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useErrorListener,
  useLostConnectionListener,
} from "@liveblocks/react/suspense";

import { Canvas } from "@/components/editor/canvas";

function CanvasError() {
  return (
    <div className="grid h-full w-full place-items-center p-6 text-center" role="alert">
      <div>
        <p className="text-sm font-medium">Unable to connect to the canvas.</p>
        <p className="mt-2 text-sm text-muted-foreground">Check your connection and refresh to try again.</p>
      </div>
    </div>
  );
}

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? <CanvasError /> : this.props.children;
  }
}

function CanvasRoom() {
  const [hasConnectionError, setHasConnectionError] = useState(false);

  useErrorListener((error) => {
    if (error.context.type === "ROOM_CONNECTION_ERROR") {
      setHasConnectionError(true);
    }
  });

  useLostConnectionListener((event) => {
    if (event === "failed") setHasConnectionError(true);
    if (event === "restored") setHasConnectionError(false);
  });

  if (hasConnectionError) return <CanvasError />;

  return (
    <ClientSideSuspense
      fallback={
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground" role="status">
          Loading canvas…
        </div>
      }
    >
      <Canvas />
    </ClientSideSuspense>
  );
}

export function EditorCanvas({ roomId }: { roomId: string }) {
  return (
    <div className="h-full w-full">
      <CanvasErrorBoundary key={roomId}>
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
          <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }} initialStorage={{}}>
            <CanvasRoom />
          </RoomProvider>
        </LiveblocksProvider>
      </CanvasErrorBoundary>
    </div>
  );
}
