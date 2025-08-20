import { Outlet } from "react-router";
import Sidebar from "./Layout/Sidebar/Sidebar";
import Navbar from "./Layout/Sidebar/Navbar";

export default function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle checkbox */}
      <input
        id="drawer-sidebar"
        type="checkbox"
        className="drawer-toggle peer"
      />

      {/* Main content area */}
      <div className="drawer-content flex flex-col h-screen">
        {/* Mobile hamburger toggle (hidden when drawer is open) */}
        <label
          htmlFor="drawer-sidebar"
          className="btn btn-primary fixed top-4 left-4 drawer-button lg:hidden peer-checked:hidden"
        >
          ☰
        </label>

        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic routed content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        {/* Overlay to close drawer on mobile */}
        <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}
