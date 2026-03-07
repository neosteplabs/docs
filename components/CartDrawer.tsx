"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, totalPrice, increaseQty, decreaseQty } = useCart();
  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[380px] max-w-full
          bg-white border-l border-slate-200 shadow-xl
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm tracking-wide uppercase font-semibold text-slate-800">
            Research Cart
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {items.length === 0 && (
            <p className="text-slate-500 text-sm">
              Cart is empty.
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start border-b pb-4"
            >
              <div className="flex-1 pr-4">
                <div className="text-sm font-medium text-slate-900">
                  {item.name}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {item.sku}
                </div>

                <div className="flex items-center mt-3 border border-slate-200 w-fit">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition"
                  >
                    −
                  </button>

                  <span className="px-4 text-sm">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-sm font-medium text-slate-900">
                ${(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-5 space-y-3 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
{/* Free Shipping Progress */}
{(() => {
  const FREE_SHIPPING_THRESHOLD = 250;
  const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
  const progress = Math.min(totalPrice / FREE_SHIPPING_THRESHOLD, 1);

  return (
    <div className="mt-3">
      {totalPrice < FREE_SHIPPING_THRESHOLD ? (
        <p className="text-xs text-slate-600 mb-2">
          You're ${remaining.toFixed(2)} away from
          <span className="font-semibold"> FREE shipping</span>
        </p>
      ) : (
        <p className="text-xs text-green-600 font-semibold mb-2">
          🎉 You unlocked FREE shipping!
        </p>
      )}

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </div>
  );
})()}

            <p className="text-xs text-slate-400 text-center">
              All products sold for laboratory research use only.
            </p>

            <button
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="w-full bg-black text-white py-3 text-xs tracking-widest uppercase hover:opacity-90 transition"
            >
              Review Secure Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}