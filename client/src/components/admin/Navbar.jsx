import { LogOut } from "lucide-react";
import { useAppContext } from "../../context/Context";
import logo from '../../assets/images/logo.svg'

const Navbar = () => {
  const { isOwnerLogin, navigate, setIsOwnerLogin, setAdminToken } = useAppContext();

  const handleLogout = () => {
    setIsOwnerLogin(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    setAdminToken(null)
    navigate("/owner/login");
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 sm:py-4">
      <div className="flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-primary transition-all duration-200 hover:scale-105 shrink-0">
            <img src={logo} className="h-6 w-6 sm:h-7 sm:w-7" alt="Logo" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-gray-800 tracking-tight leading-none">
              Admin Panel
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Bus Management System</p>
          </div>
        </div>

        {/* Right: User + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Email badge — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold uppercase">
                {isOwnerLogin?.email?.charAt(0) || "A"}
              </span>
            </div>
            <span className="text-sm text-gray-600 font-medium truncate max-w-[160px]">
              {isOwnerLogin?.email || "admin@example.com"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 sm:gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:text-red-600 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;