import Title from './Title'
import { CalendarCheck, Headphones, Lock, Ticket } from 'lucide-react'

const Data = [
    {
        icon: CalendarCheck,
        name:"Easy Booking",
        description:"Book tickets in seconds with our simple booking process."
    },
    {
        icon: Lock,
        name:"Secure Payments",
        description:"Your transactions are protected with safe payment systems."
    },
    {
        icon: Ticket,
        name:"Instant Ticket Confirmation",
        description:"Get your e-ticket immediately after booking — no printing required."
    },
    {
        icon: Headphones,
        name:"24/7 Support",
        description:"Our support team is always ready to help you."
    },


]

const HeroSection2 = () => {
  return (
    <div className='px-2 sm:px-4 md:px-6 lg:px-20 pt-45 pb-20'>
        <Title title1='Why' title2='Choose Us' subTitle='Travel across Pakistan with comfort, safety, and confidence.' />

         <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-3'>
               {
                Data.map((item,index) => {
                    const Icon = item.icon
                    return(
                        <div key={index} className='bg-[#fff] p-5 border border-gray-200 rounded-md'>
                            <div>
                                <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center'>
                                {<Icon className='text-white' />}
                            </div>
                            <div>
                                <h2 className='text-lg font-semibold mt-2'>{item.name}</h2>
                                <p className='text-[15px] text-gray-500 mt-1'>{item.description}</p>
                            </div>
                            </div>
                        </div>
                    )
                })
               }
         </div>
    </div>
  )
}

export default HeroSection2
