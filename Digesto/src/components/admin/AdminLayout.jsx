import { Outlet } from "react-router";
import Sidebar from "./Layout/Sidebar/Sidebar";
import Navbar from "./Layout/Sidebar/Navbar";

export default function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
     
      <input
        id="drawer-sidebar"
        type="checkbox"
        className="drawer-toggle peer"
      />
      <label
          htmlFor="drawer-sidebar"
          className="btn btn-primary fixed top-4 left-4 z-[1001] drawer-button lg:hidden peer-checked:hidden"
        >
          ☰
        </label>
      <div className="drawer-content min-h-screen">
        <Navbar />
        <main className="p-4">
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
