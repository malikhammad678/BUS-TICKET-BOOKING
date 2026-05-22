import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/Context'
import hero_img from '../assets/images/bus-img.png'

const Hero = () => {

  const { loginUser, navigate } = useAppContext()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (from)     params.set('from', from)
    if (to)       params.set('to', to)
    if (date)     params.set('date', date)
    if (maxPrice) params.set('maxPrice', maxPrice)

    navigate(`/buses?${params.toString()}`)
  }

  return (
    <div className='hero-section flex flex-col lg:flex-row lg:items-center lg:justify-between justify-start px-4 sm:px-6 md:px-10 lg:px-20 relative'>

      <div className='w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left pt-30 sm:pt-8 lg:pt-0'>

        <h1 className='text-[32px] sm:text-[44px] md:text-[50px] lg:text-[55px] font-semibold leading-tight'>
          Travel <span className='text-primary'>Smarter</span> Across Pakistan
        </h1>

        <p className='text-base sm:text-lg text-gray-700 mt-3 max-w-[520px]'>
          Book bus tickets instantly. Compare prices, choose your seat, and travel stress-free.
        </p>

        <div className='mt-5 flex items-center gap-4 flex-wrap justify-center lg:justify-start'>
          <button onClick={() => navigate("/buses")} className='py-2.5 sm:py-3 text-base sm:text-lg cursor-pointer rounded-lg px-6 sm:px-8 bg-primary text-white hover:scale-105 transition-all duration-300'>
            Book Ticket
          </button>
          <button onClick={() => navigate("/contact")} className='py-2.5 sm:py-3 text-base sm:text-lg rounded-lg px-6 sm:px-8 bg-transparent border-2 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer border-primary text-primary'>
            Contact Us
          </button>
        </div>
      </div>

      <div className='lg:block hidden'>
        <img
          src={hero_img}
          className='absolute w-[580px] xl:w-[620px] top-[50%] right-0 translate-y-[-50%] pointer-events-none select-none'
          alt="Bus illustration"
        />
      </div>


      <div className='
        mt-8
        lg:absolute lg:mt-0 lg:mb-0 lg:-bottom-16 lg:left-1/2 lg:-translate-x-1/2
        w-full lg:w-[80%]
        bg-white rounded-2xl shadow-2xl p-4 sm:p-6
      '>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-end'>

          <div className='flex flex-col gap-1'>
            <label className='text-xs sm:text-sm text-gray-500 font-medium'>From</label>
            <input
              type="text"
              placeholder="Karachi"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className='w-full text-black border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 outline-none focus:border-primary text-sm transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs sm:text-sm text-gray-500 font-medium'>To</label>
            <input
              type="text"
              placeholder="Lahore"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className='w-full border text-black border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 outline-none focus:border-primary text-sm transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs sm:text-sm text-gray-500 font-medium'>Departure</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 outline-none focus:border-primary text-sm transition-colors text-black'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs sm:text-sm text-gray-500 font-medium'>Max Price (Rs.)</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 outline-none focus:border-primary text-sm text-black transition-colors'
            >
              <option value=''>Any Price</option>
              <option value='1000'>Up to Rs. 1,000</option>
              <option value='2000'>Up to Rs. 2,000</option>
              <option value='3000'>Up to Rs. 3,000</option>
              <option value='5000'>Up to Rs. 5,000</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className='sm:col-span-2 md:col-span-1 lg:col-span-1 bg-primary text-white rounded-lg py-2.5 sm:py-3 cursor-pointer font-semibold text-sm sm:text-base hover:scale-105 transition-all duration-300 w-full'
          >
            Search Bus
          </button>

        </div>
      </div>

    </div>
  )
}

export default Hero