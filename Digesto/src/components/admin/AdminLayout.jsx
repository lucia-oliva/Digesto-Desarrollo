import { Outlet } from 'react-router';
import NavBarAdmin from './Layout/NavBarAdmin'
import SideBar from './Layout/Sidebar/Sidebar';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <NavBarAdmin />
      <div className="flex flex-1 pt-16">
        <SideBar />
        <main className="flex-1 p-6 ml-0 md:ml-60 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
