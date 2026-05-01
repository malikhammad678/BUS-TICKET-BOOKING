import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/Context'
import hero_img from '../assets/images/bus-img.png'

const Hero = () => {

  const { loginUser } = useAppContext()
  const navigate = useNavigate()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (from)    params.set('from', from)
    if (to)      params.set('to', to)
    if (date)    params.set('date', date)
    if (maxPrice) params.set('maxPrice', maxPrice)

    navigate(`/buses?${params.toString()}`)
  }

  return (
    <div className='hero-section flex items-center lg:justify-between justify-center px-2 sm:px-4 md:px-6 lg:px-20 relative'>

      <div className='w-[55%]'>
        <h1 className='text-[55px] max-lg:text-center font-semibold leading-15'>
          Travel <span className='text-primary'>Smarter</span> Across Pakistan
        </h1>
        <p className='text-lg text-gray-700 mt-2 max-lg:text-center'>
          Book bus tickets instantly. Compare prices, choose your seat, and travel stress-free.
        </p>

        <div className='mt-4 flex items-center max-lg:justify-center gap-5'>
          <button className='py-3 text-lg cursor-pointer rounded-lg px-8 bg-primary text-white hover:scale-105 transition-all duration-300'>
            {loginUser ? "Book Ticket" : "Get Started"}
          </button>
          <button className='py-3 text-lg rounded-lg px-8 bg-transparent border-2 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer border-primary text-primary'>
            Contact Us
          </button>
        </div>
      </div>

      <div className='lg:block hidden'>
        <img src={hero_img} className='absolute w-150 top-[50%] right-0 translate-y-[-50%]' alt="" />
      </div>

      {/* ── Search Card ── */}
      <div className='absolute -bottom-16 left-1/2 translate-x-[-50%] w-[90%] lg:w-[80%] bg-white rounded-2xl shadow-2xl p-6'>

        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>

          {/* From */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-gray-500'>From</label>
            <input
              type="text"
              placeholder="Karachi"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className='w-full text-black border border-gray-400 rounded-lg px-3 py-2 outline-none focus:border-primary'
            />
          </div>

          {/* To */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-gray-500'>To</label>
            <input
              type="text"
              placeholder="Lahore"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className='w-full border text-black border-gray-400 rounded-lg px-3 py-2 outline-none focus:border-primary'
            />
          </div>

          {/* Date */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-gray-500'>Departure</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full border border-gray-400 rounded-lg px-3 py-2 outline-none focus:border-primary'
            />
          </div>

          {/* Max Price — replaces Adults */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm text-gray-500'>Max Price (Rs.)</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className='w-full border border-gray-400 rounded-lg px-3 py-2 outline-none focus:border-primary text-black'
            >
              <option value=''>Any Price</option>
              <option value='1000'>Up to Rs. 1,000</option>
              <option value='2000'>Up to Rs. 2,000</option>
              <option value='3000'>Up to Rs. 3,000</option>
              <option value='5000'>Up to Rs. 5,000</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className='bg-primary text-white rounded-lg py-3 cursor-pointer font-semibold hover:scale-105 transition-all duration-300'
          >
            Search Bus
          </button>

        </div>
      </div>
    </div>
  )
}

export default Hero