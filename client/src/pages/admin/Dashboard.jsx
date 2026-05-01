import { buses, mockBookings } from "../../assets/data"
import { Users, Bus, BookOpen, MapPin, Clock, Calendar } from "lucide-react";
import { useAppContext } from "../../context/Context";



const statusColor = (status) => {
  if (status === "Confirmed") return "bg-green-100 text-green-600";
  if (status === "Pending") return "bg-yellow-100 text-yellow-600";
  if (status === "Cancelled") return "bg-red-100 text-red-500";
  return "bg-gray-100 text-gray-500";
};

const Dashboard = () => {

  const { isOwnerLogin, totalNoBuses, totalNoUsers, totalNoBookings, bookings, buses, allUsers, navigate } = useAppContext()

  const statsCards = [
  {
    label: "Total Users",
    value: totalNoUsers,
    icon: Users,
    color: "bg-blue-50 text-blue-500",
    border: "border-blue-100",
  },
  {
    label: "Total Bookings",
    icon: BookOpen,
    value:totalNoBookings,
    color: "bg-primary/10 text-primary",
    border: "border-primary/20",
  },
  {
    label: "Total Buses",
    value: totalNoBuses,
    icon: Bus,
    color: "bg-green-50 text-green-500",
    border: "border-green-100",
  },
];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back, {isOwnerLogin?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary text-base">Recent Bookings</h2>
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline"
          
          onClick={() => navigate("/owner/manage-bookings")}

          >View All</span>
        </div>
        <div className="divide-y divide-gray-50">
          {bookings?.slice(0, 3).map((b) => (
            <div key={b.bookingId} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{b.passengerName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {b?.bus?.fromCity} → {b?.bus?.toCity}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} /> {b.bus?.date}
              </div>
              <div className="text-sm font-bold text-gray-700">Rs. {b.bus?.price.toLocaleString()}</div>
              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${statusColor(b.bookingStatus)}`}>
                {b.bookingStatus}
              </span>
            </div>
          ))}
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-primary text-base">Recent Buses</h2>
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline" onClick={
            () => navigate("/owner/bus-list")
          }>View All</span>
        </div>
        <div className="divide-y divide-gray-50">
          {buses?.slice(0, 3).map((b) => (
            <div key={b._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3 min-w-0">
                <img src={b?.image} alt={b?.busName} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{b?.busName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {b?.fromCity} → {b?.toCity}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} /> {b?.duration}
              </div>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {b?.busType}
              </span>
              <div className="text-sm font-bold text-gray-700">Rs. {b?.price?.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

    
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold  text-base text-primary">Recent Users</h2>
          <span className="text-xs text-primary font-semibold cursor-pointer hover:underline"
          
          onClick={() => navigate("/owner/manage-users")}

          >View All</span>
        </div>
        {
          allUsers?.slice(0,3).map((user) => (
             <div key={user._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition ">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-extrabold uppercase">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <span className={`ml-auto text-[11px] font-semibold px-3 py-1 rounded-full ${user?.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50  text-green-600'}`} >
            {
              user?.isBlocked ? 'Blocked' : 'Active'
            }
          </span>
        </div>
          ))
        }
        
      </div>

    </div>
  );
};

export default Dashboard;   