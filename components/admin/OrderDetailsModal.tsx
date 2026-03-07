
"use client";

type OrderDetailsModalProps = {
  order: any;
  onClose: () => void;
};

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[750px] max-h-[85vh] overflow-y-auto p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6">
          Order Details
        </h2>

        {/* ===== ORDER META ===== */}
        <div className="mb-6 text-sm space-y-2">
          <p><strong>Order ID:</strong> {order.id}</p>

          <p>
            <strong>Status:</strong>{" "}
            {order.fulfillmentStatus || order.status || "—"}
          </p>

          <p>
            <strong>Total:</strong> $
            {order.financials?.total ?? 0}
          </p>

          <p>
            <strong>Inventory Adjusted:</strong>{" "}
            {order.inventoryAdjusted ? "Yes" : "No"}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleString()
              : "—"}
          </p>

          <p>
            <strong>Updated:</strong>{" "}
            {order.updatedAt?.toDate
              ? order.updatedAt.toDate().toLocaleString()
              : "—"}
          </p>
        </div>

        {/* ===== ITEMS TABLE ===== */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
            Items
          </h3>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-slate-100 text-xs uppercase text-slate-500 px-4 py-2">
              <div className="col-span-2">Product</div>
              <div>SKU</div>
              <div>Qty</div>
              <div>Total</div>
            </div>

            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-5 px-4 py-3 text-sm border-t"
                >
                  <div className="col-span-2">
                    {item.name}
                  </div>

                  <div>{item.sku || "—"}</div>

                  <div>{item.quantity}</div>

                  <div>
                    ${Number(item.price) * Number(item.quantity)}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-slate-400">
                No items recorded.
              </div>
            )}
          </div>
        </div>

        {/* ===== CLOSE BUTTON ===== */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
