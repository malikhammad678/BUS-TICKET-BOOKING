import { Calendar, Clock, Star } from "lucide-react";
import { useAppContext } from '../context/Context';
import { useNavigate } from 'react-router-dom';

const BusCard = ({ bus }) => {  
  const { loginUser } = useAppContext();
  const navigate = useNavigate();

  const handleBook = () => {  
    if (!loginUser) {
      navigate('/login', { state: { redirectTo: `/booking/${bus._id}`, bus } });
    } else {
      navigate(`/booking/${bus._id}`, { state: { bus } });
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img src={bus.image} alt={bus.busName} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
        {bus.bestSeller === true && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
            <Star size={11} className="fill-white" /> Best Seller
          </span>
        )}
        {bus.busType && (
          <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {bus.busType}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">
          {bus.fromCity}<span className="text-primary mx-2">→</span>{bus.toCity}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{bus.busName}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-3">
          <span className="flex items-center gap-2"><Calendar size={18} /> {bus.date}</span>
          <span className="flex items-center gap-2"><Clock size={18} /> {bus.departureTime}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Duration: {bus.duration}</p>
        <div className="flex items-center justify-between mt-5">
          <h4 className="text-2xl font-bold text-primary">Rs. {bus.price.toLocaleString()}</h4>
          <button onClick={handleBook} className="bg-primary text-white px-4 py-2 rounded-lg hover:scale-105 transition cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;