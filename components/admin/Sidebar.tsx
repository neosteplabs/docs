"use client";

type View =
  | "dashboard"
  | "inventory"
  | "orders"
  | "shipments"
  | "trash"
  | "users";

type Props = {
  activeView: View;
  setActiveView: (view: View) => void;
  trashCount: number;
};

export default function Sidebar({
  activeView,
  setActiveView,
  trashCount,
}: Props) {
  return (
    <div className="h-full w-full bg-slate-900 text-slate-200 flex flex-col px-5 py-8">

      {/* HEADER */}
      <h1 className="text-lg font-semibold mb-8 tracking-wide text-white">
        NeoStep Admin
      </h1>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2 text-sm">

        {/* DASHBOARD */}
        <button
          onClick={() => setActiveView("dashboard")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "dashboard"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Dashboard
        </button>

        {/* INVENTORY */}
        <button
          onClick={() => setActiveView("inventory")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "inventory"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Inventory
        </button>

        {/* ORDERS */}
        <button
          onClick={() => setActiveView("orders")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "orders"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Orders
        </button>

        {/* SHIPMENTS */}
        <button
          onClick={() => setActiveView("shipments")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "shipments"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Shipments
        </button>

        {/* TRASH */}
        <button
          onClick={() => setActiveView("trash")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "trash"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Trash ({trashCount})
        </button>

        {/* USERS */}
        <button
          onClick={() => setActiveView("users")}
          className={`text-left px-3 py-2 rounded-md transition ${
            activeView === "users"
              ? "bg-slate-700 text-white"
              : "hover:bg-slate-800"
          }`}
        >
          Users
        </button>

      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-xs opacity-50 pt-8">
        Internal Control Panel
      </div>

    </div>
  );
}