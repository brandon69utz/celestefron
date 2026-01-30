import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import RightPanel from "../components/RightPanel.jsx";

export default function AppLayout() {
  const location = useLocation();

  // Mostrar panel derecho solo en “Comunicación / Blog / Mensajes”
  const showRight = location.pathname.includes("/app/mensajes");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Topbar />

      <div className="mx-auto flex max-w-[1400px] gap-4 px-3 py-4">
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-sm text-slate-500">Condominios → Panel</div>
              <div className="mt-1 text-lg font-semibold">Panel de control</div>
            </div>

            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Right panel */}
        {showRight && (
          <aside className="hidden w-[300px] shrink-0 xl:block">
            <RightPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
