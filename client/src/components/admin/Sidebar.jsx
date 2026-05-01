import { LayoutDashboard, Bus, PlusCircle, BookOpen, ChevronRight, User2, Users2, MessageCircleMoreIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/owner/dashboard" },
  { label: "Add Bus", icon: PlusCircle, path: "/owner/add-bus" },
  { label: "Bus List", icon: Bus, path: "/owner/bus-list" },
  { label: "Manage Bookings", icon: BookOpen, path: "/owner/manage-bookings" },
  { label: "Manage Users", icon: Users2, path: "/owner/manage-users" },
  { label: "Manage Messages", icon: MessageCircleMoreIcon, path: "/owner/manage-messages" }
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col ">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
              ${isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-primary/10"}`}>
                  <Icon size={17} className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary"} />
                </div>
                <span className="flex-1">{label}</span>
                <ChevronRight
                  size={14}
                  className={`transition-all duration-200 ${isActive ? "opacity-70" : "opacity-0 group-hover:opacity-40"}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;