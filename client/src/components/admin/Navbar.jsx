import { Bus, LogOut } from "lucide-react";
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
    <div className="bg-white border-b border-gray-200 py-4">
      <div className=" flex items-center justify-between">


        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary transition-all duration-200 hover:scale-[1.05]">
                              <img src={logo} className="h-7 w-7" alt="" />
            </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-800 tracking-tight leading-none">
              Admin Panel
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Bus Management System</p>
          </div>
        </div>

    
        <div className="flex items-center gap-3">

          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase">
                {isOwnerLogin?.email?.charAt(0) || "A"}
              </span>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {isOwnerLogin?.email || "admin@example.com"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;