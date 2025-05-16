import SidebarMenuContent from "./SideBarContent";

function SideBar() {
  return (
    <aside className="hidden md:block w-60 bg-primary text-white pt-20 fixed top-0 left-0 h-full z-40">
      <SidebarMenuContent className="p-4" />
    </aside>
  );
}

export default SideBar;
