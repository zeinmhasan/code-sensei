"use client";

import { FileNode } from "@/types";
import { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick?: (node: FileNode) => void;
  onNodeRightClick?: (node: FileNode, event: React.MouseEvent) => void;
}

export default function FileTree({
  nodes,
  onFileClick,
  onNodeRightClick,
}: FileTreeProps) {
  return (
    <div className="text-sm">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onFileClick={onFileClick}
          onNodeRightClick={onNodeRightClick}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: FileNode;
  level?: number;
  onFileClick?: (node: FileNode) => void;
  onNodeRightClick?: (node: FileNode, event: React.MouseEvent) => void;
}

function TreeNode({
  node,
  level = 0,
  onFileClick,
  onNodeRightClick,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (onFileClick) {
      onFileClick(node);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNodeRightClick) {
      onNodeRightClick(node, e);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        {isFolder && (
          <span className="text-gray-400">
            {isOpen ? (
              <FaChevronDown size={10} />
            ) : (
              <FaChevronRight size={10} />
            )}
          </span>
        )}
        {isFolder ? (
          isOpen ? (
            <FaFolderOpen className="text-yellow-500" size={14} />
          ) : (
            <FaFolder className="text-yellow-500" size={14} />
          )
        ) : (
          <FaFile className="text-gray-400" size={14} />
        )}
        <span className="text-gray-200">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              onNodeRightClick={onNodeRightClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
