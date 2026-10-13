"use client";

import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { Background, BackgroundVariant, ConnectionMode, MiniMap, ReactFlow } from "@xyflow/react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

import "@xyflow/react/dist/style.css";

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  return (
    <ReactFlow<CanvasNode, CanvasEdge>
      colorMode="dark"
      connectionMode={ConnectionMode.Loose}
      edges={edges}
      fitView
      nodes={nodes}
      onConnect={onConnect}
      onDelete={onDelete}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <Background bgColor="#090b0f" color="#303640" gap={20} size={1} variant={BackgroundVariant.Dots} />
      <MiniMap<CanvasNode> nodeColor={(node) => node.data.color} />
    </ReactFlow>
  );
}
