import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import RightPanel from "../components/RightPanel.jsx";

export default function ClassicLayout() {
  const location = useLocation();
  const showRight = location.pathname.includes("/app/mensajes");

  const getPageTitle = () => {
    if (location.pathname.includes("/app/mensajes")) return "Mensajes";
    if (location.pathname.includes("/app/residentes")) return "Residentes";
    if (location.pathname.includes("/app/departamentos")) return "Departamentos";
    if (location.pathname.includes("/app/pagos")) return "Pagos";
    if (location.pathname.includes("/app/eventos")) return "Eventos";
    if (location.pathname.includes("/app/encuesta-admin")) return "Encuesta en vivo";
    if (location.pathname.includes("/app/mis-encuestas")) return "Mis encuestas";
    return "Panel de control";
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Topbar />

      <div className="mx-auto flex max-w-[1400px] gap-4 px-3 py-4">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-sm text-slate-500">CondominioSOFT → Panel</div>
              <div className="mt-1 text-lg font-semibold">{getPageTitle()}</div>
            </div>

            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </main>

        {showRight && (
          <aside className="hidden w-[300px] shrink-0 xl:block">
            <RightPanel />
          </aside>
        )}
      </div>
    </div>
  );
}