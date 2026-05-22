import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg'

const Footer = () => {
  const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "About", "Available Buses", "Contact Us"]
        },
        {
            title: "Need Help?",
            links: ["Booking Information", "Return & Refund Policy", "Payment Methods", "Track your Route", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];

    return (
        <div className="px-4 sm:px-4 md:px-6 lg:px-20 pt-10 pb-5">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <Link to={"/"}  className="flex items-center gap-2 text-black font-[500]">
    
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary transition-all duration-200 hover:scale-[1.05]">
                    <img src={logo} className="h-7 w-7" alt="" />
            </div>
            
            <h1 className="text-[22px]">BusGo</h1>

                     </Link>
                    <p className="max-w-[410px] mt-6">We make bus travel simple, safe, and stress-free. Compare routes, choose your seat, and book instantly. Our platform connects you with trusted bus operators for a seamless journey every time.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © - <a href="#" className="text-primary font-bold">BusGo</a> - All Right Reserved.
            </p>
        </div>
    );
}

export default Footer
