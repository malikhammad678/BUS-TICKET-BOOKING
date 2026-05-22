import { Link, NavLink } from "react-router-dom"
import user_ic from '../assets/images/user-icon.svg'
import logo from '../assets/images/logo.svg'
import { useAppContext } from "../context/Context"
import { user } from "../assets/data"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const Navbar = () => {

    const { userToken, setUserToken, navigate, setLoginUser, loginUser } = useAppContext()
    const [openMenu, setOpenMenu] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('userToken')
        setUserToken(null)
        setLoginUser(null)
        toast.success('Logged Out!')
    }

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white z-50 px-4 sm:px-6 md:px-10 lg:px-20 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">

                {/* Logo */}
                <Link to={"/"} className="flex items-center gap-2 text-black font-medium">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-primary transition-all duration-200 hover:scale-105">
                        <img src={logo} className="h-6 w-6 sm:h-7 sm:w-7" alt="BusGo Logo" />
                    </div>
                    <h1 className="text-lg sm:text-[22px] font-semibold">BusGo</h1>
                </Link>

                <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/about", label: "About" },
                        { to: "/buses", label: "Available Buses" },
                        { to: "/contact", label: "Contact" },
                    ].map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `text-sm lg:text-base text-black duration-200 hover:text-primary relative pb-1
                                ${isActive ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full" : ""}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Side: Auth + Hamburger */}
                <div className="flex items-center gap-3">

                    {!userToken ? (
                        <button
                            onClick={() => setUserToken(user)}
                            className="px-5 py-1.5 sm:px-8 sm:py-2 text-sm sm:text-base text-white rounded-3xl cursor-pointer bg-primary transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="relative group">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <img className="h-7 w-7 rounded-full object-cover" src={user_ic} alt="User" />
                                <span className="text-sm hidden sm:block text-gray-700 max-w-[120px] truncate">
                                    {loginUser?.email}
                                </span>
                            </div>

                            {/* Dropdown */}
                            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[160px] bg-white shadow-lg rounded-xl border border-gray-100 py-2 px-3 hidden group-hover:block z-50">
                                <NavLink
                                    to={"/my-bookings"}
                                    className="block text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-100 transition-colors duration-200"
                                >
                                    My Bookings
                                </NavLink>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="block w-full text-left text-sm text-gray-700 hover:text-primary pt-2 transition-colors duration-200 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hamburger - mobile only */}
                    <button
                        className="md:hidden flex items-center justify-center p-1 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setOpenMenu(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* ===== MOBILE OVERLAY BACKDROP ===== */}
            {openMenu && (
                <div
                    className="fixed inset-0 bg-black/30 z-50 md:hidden"
                    onClick={() => setOpenMenu(false)}
                />
            )}

            {/* ===== MOBILE SIDEBAR MENU ===== */}
            <div className={`fixed top-0 right-0 w-[75%] max-w-[300px] h-full bg-white border-l-2 border-primary z-60 md:hidden transition-transform duration-300 ease-in-out shadow-2xl
                ${openMenu ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setOpenMenu(false)}
                    className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center bg-primary rounded-full text-white hover:scale-105 transition-transform"
                    aria-label="Close Menu"
                >
                    <X size={18} />
                </button>

                {/* Mobile Logo */}
                <div className="pt-6 pl-6 pb-4 border-b border-gray-100">
                    <Link to={"/"} onClick={() => setOpenMenu(false)} className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary">
                            <img src={logo} className="h-5 w-5" alt="BusGo Logo" />
                        </div>
                        <span className="text-lg font-semibold">BusGo</span>
                    </Link>
                </div>

                {/* Mobile Links */}
                <nav className="pt-6 pl-6 flex flex-col gap-1">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/about", label: "About" },
                        { to: "/buses", label: "Available Buses" },
                        { to: "/contact", label: "Contact" },
                    ].map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setOpenMenu(false)}
                            className={({ isActive }) =>
                                `text-[15px] py-2.5 px-3 rounded-lg transition-all duration-200
                                ${isActive
                                    ? "text-primary bg-primary/10 font-medium"
                                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Mobile Auth */}
                <div className="absolute bottom-8 left-6 right-6">
                    {!userToken ? (
                        <button
                            onClick={() => { setUserToken(user); setOpenMenu(false) }}
                            className="w-full py-2.5 text-white rounded-3xl bg-primary hover:scale-105 transition-all duration-200 font-medium"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 mb-2 truncate">{loginUser?.email}</p>
                            <NavLink
                                to={"/my-bookings"}
                                onClick={() => setOpenMenu(false)}
                                className="block text-sm text-gray-700 hover:text-primary py-2 transition-colors"
                            >
                                My Bookings
                            </NavLink>
                            <button
                                onClick={() => { handleLogout(); setOpenMenu(false) }}
                                className="w-full mt-2 py-2 text-sm text-white bg-primary rounded-xl hover:opacity-90 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar