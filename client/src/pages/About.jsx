import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import { useAppContext } from '../context/Context';

const About = () => {

    const { navigate } = useAppContext()

  return (
        <>
          <div className='bg-gray-50'>

          
            <section className=" mb-20 pt-40 flex flex-col md:flex-row items-center justify-between px-2 sm:px-4 md:px-6 lg:px-20 ">
                <div className="relative max-w-[50%] shadow-2xl shadow-primary/40 rounded-2xl  overflow-hidden shrink-0">
                    <img className=" w-full object-cover rounded-2xl"
                        src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"
                        alt="" />
                
                </div>
                <div className="text-sm text-slate-600 max-w-[50%]">
                    <h1 className="text-xl uppercase font-semibold text-slate-700">Who we are?</h1>
                    <div className="w-24 h-[3px] rounded-full bg-primary"></div>
                    <p className="mt-8 text-[15px] text-gray-500">Our company is committed to transforming the travel experience by providing innovative and reliable digital solutions for bus ticket booking. </p>
                    <p className="mt-4 text-[15px] text-gray-500">We focus on delivering convenience, efficiency, and customer satisfaction through modern technology and user-friendly services. With a dedicated team and a passion for improving transportation accessibility, we aim to connect passengers with trusted bus operators while ensuring a smooth and hassle-free booking process.</p>
                    <p className="mt-4 text-[15px] text-gray-500">Our vision is to make travel planning simple, secure, and accessible for everyone, helping people reach their destinations comfortably and confidently.</p>
                    <span onClick={() => navigate("/contact")} className="flex items-center w-max gap-2 mt-8 hover:scale-105 transition cursor-pointer bg-primary py-3 px-8 rounded-lg text-white">
                        <span>Contact Us</span>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                                fill="#fff" />
                        </svg>
                    </span>
                </div>
            </section>
            <Testimonials />
            <Newsletter />
            </div>
        </>
    );
}

export default About
