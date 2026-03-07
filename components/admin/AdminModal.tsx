"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  onClose: () => void;
  width?: string;
};

export default function AdminModal({
  children,
  onClose,
  width = "w-[600px]",
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-start justify-center pt-6 pb-10">
        <div
          className={`${width} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content Area */}
          <div className="overflow-y-auto p-6 no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}