import { useEffect, useState } from "react"
import Title from "./Title"
import BusCard from "./BusCard"
import { useAppContext } from "../context/Context"

const PopularRoutes = () => {

  const { webBuses : buses } = useAppContext()

    const [popularRoutes, setPopularRoutes] = useState([])

    console.log(buses)

    useEffect(() => {
       const popular = buses?.slice(0,4).filter(bus => bus.bestSeller)
       setPopularRoutes(popular)
    },[buses])

  return (
    <div className='px-2 sm:px-4 md:px-6 lg:px-20 pt-10 pb-20 bg-gray-50'>
        <Title title1={"Popular"} title2={"Routes"} subTitle={"Explore the most frequently booked bus routes."} />
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
             {
                popularRoutes.slice(0,4).map((item,index) => (
                    <BusCard bus={item} key={index} />
                ))
             }
      </div>

    </div>
  )
}

export default PopularRoutes
