import { Outlet } from 'react-router';
import NavBarAdmin from './Layout/NavBarAdmin'
import SideBar from './Layout/Sidebar/Sidebar';

function AdminLayout() {
  return (
    <main className="min-h-screen w-full bg-base-100  flex flex-row">
        <SideBar />
          <Outlet />
    </main>
  );
}

export default AdminLayout;
