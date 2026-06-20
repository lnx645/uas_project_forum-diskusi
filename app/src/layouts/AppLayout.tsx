import { Link, Outlet, useLocation } from "react-router";
import {
  HiOutlineHome,
  HiOutlineGlobeAlt,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
} from "react-icons/hi2"; // Menggunakan Heroicons v2
import { SidebarWidgets } from "../components/SidebarWidget";
type MenuItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHeader?: boolean;
};
export const SidebarMenu = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: "Home", href: "/", icon: HiOutlineHome },
    { label: "PUBLIC", href: "#", isHeader: true },
    { label: "Questions", href: "/questions", icon: HiOutlineGlobeAlt },
    { label: "Tags", href: "/tags", icon: HiOutlineTag },
    { label: "Users", href: "/users", icon: HiOutlineUserGroup },
  ];

  return (
    <nav className="flex flex-col w-full py-3 font-sans">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.href;
        
        if (item.isHeader) {
          return (
            <div
              key={index}
              className="mt-4 mb-1.5 px-3 pl-3 text-[10px] font-bold tracking-wider text-(--black-500) uppercase select-none"
            >
              {item.label}
            </div>
          );
        }

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex items-center gap-2 text-sm h-9 px-3 transition-all border-r-[3px] select-none
              ${
                isActive
                  ? "bg-(--black-100) text-(--black-600)  border-r-(--theme-primary-custom-400)"
                  : "text-(--black-500) border-r-transparent hover:text-(--black-600) hover:bg-(--black-100)/50"
              }
            `}
          >
            {Icon && (
              <Icon
                className={`text-base w-4 h-4 shrink-0 ${
                  isActive ? "text-(--theme-primary-custom-400)" : "text-(--black-500)"
                }`}
              />
            )}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export const AppLayout = () => {
  return (
    <div className="container items-start mx-auto lg:flex min-h-[calc(100vh-59px)]">
      <aside className="sticky hidden lg:flex flex-col top-14.75 bg-(--theme-content-background-color) border-r border-(--theme-content-border-color) h-[calc(100vh-59px)] w-full max-w-48 shrink-0 overflow-y-auto">
        <div className="text-sm text-(--black-500)">
          <SidebarMenu/>
        </div>
      </aside>

      <main className="flex-1 bg-(--theme-content-background-color) min-w-0">
        <Outlet />
      </main>
      <aside className="sticky top-14.75 h-[calc(100vh-59px)] lg:w-81 shrink-0 overflow-y-auto border-l border-(--theme-content-border-color) bg-(--theme-background-color)">
       <SidebarWidgets/>
      </aside>
    </div>
  );
};
