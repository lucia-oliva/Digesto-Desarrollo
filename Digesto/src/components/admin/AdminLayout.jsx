import { Outlet } from "react-router";
import SideBarWrapper from "./Layout/Sidebar/SideBarWrapper";

function AdminLayout() {
  return (
    <div className=" max-h-screen bg-base-200 relative flex flex-row">
      <SideBarWrapper />

      <main className="w-full pr-10 mt-15 bg-base-200 overflow-auto transition-all duration-300 ml-0 md:ml-16">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
