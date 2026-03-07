"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  productId: string;
  concentrations: any[];
  setLocalConcentrations: (c: any[]) => void;
};

export default function ConcentrationPanel({
  productId,
  concentrations,
  setLocalConcentrations,
}: Props) {
  const [writingIndex, setWritingIndex] = useState<number | null>(null);

  async function adjustStock(index: number, delta: number) {
    if (writingIndex !== null) return;

    const original = [...concentrations];
    const updated = [...concentrations];

    updated[index].stock = Math.max(
      0,
      updated[index].stock + delta
    );

    setLocalConcentrations(updated);
    setWritingIndex(index);

    try {
      await updateDoc(doc(db, "products", productId), {
        concentrations: updated,
      });
    } catch (err) {
      console.error("Stock update failed:", err);
      setLocalConcentrations(original);
    } finally {
      setWritingIndex(null);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {concentrations.map((c, i) => (
        <div
          key={c.sku}
          className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-md border border-slate-200"
        >
          <div>
            <div className="font-medium text-slate-800 text-sm">
              {c.label}
            </div>
            <div className="text-xs text-slate-500">
              {c.sku}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={writingIndex === i}
              onClick={() => adjustStock(i, -1)}
              className="w-6 h-6 text-xs rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
            >
              −
            </button>

            <div className="w-8 text-center font-medium text-sm">
              {c.stock}
            </div>

            <button
              disabled={writingIndex === i}
              onClick={() => adjustStock(i, 1)}
              className="w-6 h-6 text-xs rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}