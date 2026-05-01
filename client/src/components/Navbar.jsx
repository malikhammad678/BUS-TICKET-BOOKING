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
            navigate("/login")
        }

    return (
        <>
        <header className="fixed top-0 left-0 w-full bg-white z-50 px-2 sm:px-4 md:px-6 lg:px-20 py-5 flex justify-between items-center border-b border-gray-200">
            
        <Link to={"/"}  className="flex items-center gap-2 text-black font-[500]">
    
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary transition-all duration-200 hover:scale-[1.05]">
                    <img src={logo} className="h-7 w-7" alt="" />
            </div>
            
            <h1 className="text-[22px]">BusGo</h1>

        </Link>

        <nav className="hidden items-center gap-12 md:flex ">
            <NavLink to={"/"} className={`text-md text-black duration-200 hover:text-primary relative`}>
                <p>Home</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 w-full hidden" />
            </NavLink>
            <NavLink to={"/about"} className={`text-md text-black duration-200 hover:text-primary relative `}>
                <p>About</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 w-full hidden" />
            </NavLink>
            <NavLink to={"/buses"} className={`text-md text-black duration-200 hover:text-primary relative`}>
                <p>Available Buses</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 w-full hidden" />
            </NavLink>
            <NavLink to={"/contact"} className={`text-md text-black duration-200 hover:text-primary relative`}>
                <p>Contact</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 w-full hidden" />
                </NavLink>
        </nav>

        <div className="flex items-center gap-3">
            {
            !userToken ? (
                <>
                <button onClick={() => setUserToken(user)} className="sm:px-10 sm:py-2 px-6 py-1.5 text-white rounded-3xl cursor-pointer bg-primary transition-all duration-200 hover:scale-[1.05]">
                    Login
                </button>
                </>
            ): (
                <>
                <div className="relative group">
                    <div className="flex items-center gap-2 cursor-pointer">
                    <img className="h-7" src={user_ic} alt="" />
                    <h1 className="text-sm hidden sm:block">{loginUser?.email}</h1>
                    </div>
                    <div className="absolute top-[100%] bg-white right-0 w-[100%] p-5 shadow-sm rounded-lg group-hover:block hidden
                    ">

                            <NavLink to={"/my-bookings"} className={`mb-2 block duration-300 transition-all hover:text-primary pb-2 border-b border-gray-200`}>
                                        My Bookings
                            </NavLink>

                            <button type="button" onClick={handleLogout} className="`mb-2 block duration-300 transition-all hover:text-primary pb-2 border-b border-gray-200 cursor-pointer">
                                Logout
                            </button>

                    </div>
                </div>
                </>
            )
        }
        <Menu className="md:hidden block" onClick={() => setOpenMenu(true)} />
        </div>

        </header>

        <div className={`fixed top-0 right-0 w-[80%] border-l-2 md:hidden block bg-white border-primary h-full z-60 duration-300 transition-all ${!openMenu ? 'translate-x-[100%]' : 'translate-x-0'}`}>

             <div className="absolute top-8 right-6 w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white">
                <X onClick={() => setOpenMenu(false)} />
             </div>


           <div className="pt-[100px] pl-[30px]">
             <NavLink to={"/"} className={`text-md text-black duration-200 block hover:text-primary relative`}>
                <p>Home</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0  hidden" />
            </NavLink>
            <NavLink to={"/about"} className={`text-md text-black duration-200 hover:text-primary relative mt-3 block`}>
                <p>About</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0  hidden" />
            </NavLink>
            <NavLink to={"/buses"} className={`text-md text-black duration-200 hover:text-primary relative mt-3 block`}>
                <p>Available Buses</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 hidden" />
            </NavLink>
            <NavLink to={"/contact"} className={`text-md text-black duration-200 hover:text-primary relative block mt-3`}>
                <p>Contact</p>
                <hr className="h-0.5 border-0 bg-primary absolute bottom-[-3px] left-0 hidden" />
                </NavLink>
           </div>
          
        </div>

        </>
    )
    }

    export default Navbar
