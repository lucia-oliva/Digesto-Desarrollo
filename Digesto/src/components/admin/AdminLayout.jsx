import { Outlet } from "react-router";
import SideBarWrapper from "./Layout/Sidebar/SideBarWrapper";

function AdminLayout() {
  return (
    <div className="min-h-screen  w-full bg-base-100 relative flex flex-row">
      <SideBarWrapper />

      <div className=" transition-all duration-300 ml-0 md:ml-16">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
