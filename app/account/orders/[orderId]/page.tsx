"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrderDetailWrapper() {
  return (
    <ProtectedRoute>
      <OrderDetailPage />
    </ProtectedRoute>
  );
}

function OrderDetailPage() {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || !user) return;

      const snap = await getDoc(doc(db, "orders", orderId as string));

      if (!snap.exists()) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const data = snap.data();

      // 🔒 Ownership verification
      if (data.uid !== user.uid) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      setOrder({
        id: snap.id,
        ...data,
      });

      setLoading(false);
    }

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  if (unauthorized || !order) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-lg font-semibold mb-2">
            Order Not Available
          </h1>
          <p className="text-sm text-slate-600">
            You do not have permission to view this order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-28 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              Order Details
            </h1>
            <div className="text-sm text-slate-500 mt-1">
              Order #{order.orderNumber || order.id}
            </div>
          </div>

          <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
            {order.status || "Pending Review"}
          </span>
        </div>

        <div className="text-sm text-slate-500 mb-8">
          Submitted:{" "}
          {order.createdAt?.toDate
            ? order.createdAt.toDate().toLocaleString()
            : ""}
        </div>

        {/* Line Items */}
        <div className="space-y-6">
          {order.items?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between border-b pb-4"
            >
              <div>
                <div className="text-sm font-medium">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.sku} × {item.quantity}
                </div>
              </div>

              <div className="text-sm font-medium">
                ${item.total?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="mt-10 border-t pt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              ${order.financials?.subtotal?.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>
              ${order.financials?.tax?.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              ${order.financials?.shipping?.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-base pt-4 border-t">
            <span>Total</span>
            <span>
              ${order.financials?.total?.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}