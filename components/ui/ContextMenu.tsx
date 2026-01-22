"use client";

interface ContextMenuProps {
  x: number;
  y: number;
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  onClose: () => void;
}

export default function ContextMenu({
  x,
  y,
  items,
  onClose,
}: ContextMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      {/* Menu */}
      <div
        className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-45"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            {item.icon && <span className="text-blue-400">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
