import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer-sidebar" type="checkbox" className="drawer-toggle" />
      <label
        htmlFor="drawer-sidebar"
        className="btn btn-primary fixed top-4 left-4 z-50 drawer-button lg:hidden"
      >
        ☰
      </label>
      <div className="drawer-content flex flex-col h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 pt-4">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}
