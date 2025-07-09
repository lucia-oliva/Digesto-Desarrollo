import SidebarMenuContent from "./SideBarContent";

function SideBar() {
  return (
    <aside className="group rounded-tr-4xl z-40 bg-blue-900 text-white pt-20 transition-all duration-300 w-16 hover:w-60">
      <SidebarMenuContent className="p-2" />
    </aside>
  );
}

export default SideBar;
