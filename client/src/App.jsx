import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useState } from "react"
import Home from "./pages/Home"
import About from "./pages/About"
import Buses from "./pages/Buses"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Navbar from './components/Navbar'
import Footer from "./components/Footer"
import { useAppContext } from "./context/Context"
import BookingPage from "./pages/BookingPage"
import MyBookings from "./pages/MyBookings"
import OwnerLogin from "./pages/admin/OwnerLogin"
import Dashboard from "./pages/admin/Dashboard"
import AddBus from "./pages/admin/AddBus"
import BusList from "./pages/admin/BusList"
import ManageBookings from "./pages/admin/ManageBookings"
import Layout from "./pages/admin/Layout"
import ManageUsers from "./pages/admin/ManageUsers"
import { Toaster } from 'react-hot-toast'
import ManageMessages from "./pages/admin/ManageMessages"

// 🆕 Self Booking Imports
import SelfBookingForm from "./components/SelfBookingForm"
import SelfBookingSeatSelection from "./pages/SelfBookingSeatSelection"
import SelfBookingPayment from "./pages/SelfBookingPayment"
import BookingSuccess from "./pages/BookingSuccess"

// 🆕 Floating Button Component
const FloatingCreateTripButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full p-4 shadow-2xl hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      title="Create Your Own Trip"
    >
      <div className="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:rotate-12 transition-transform duration-300"
        >
          <path d="M12 5v14M5 12h14"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </div>
      <span className="absolute right-16 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Create Trip
      </span>
    </button>
  )
}

const App = () => {
  const { adminToken, userToken } = useAppContext()
  const location = useLocation()
  const [showSelfBooking, setShowSelfBooking] = useState(false)

  const isAdminPath = location.pathname.startsWith("/owner")
  const isAuthPage = location.pathname === "/login" || location.pathname === "/owner/login"
  const isBookingFlow = location.pathname.includes("/booking") || 
                        location.pathname.includes("/self-booking") ||
                        location.pathname === "/booking-success"

  // Don't show floating button on admin pages, auth pages, and booking flow
  const showFloatingButton = userToken && !isAdminPath && !isAuthPage && !isBookingFlow

  return (
    <div>
      {userToken && !isAdminPath && <Navbar />}
      
      <Routes>
        {/* Existing Routes */}
        <Route path="/login" element={!userToken ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/" element={userToken ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/about" element={userToken ? <About /> : <Navigate to={"/login"} />} />
        <Route path="/buses" element={userToken ? <Buses /> : <Navigate to={"/login"} />} />
        <Route path="/contact" element={userToken ? <Contact /> : <Navigate to={"/login"} />} />
        <Route path="/my-bookings" element={userToken ? <MyBookings /> : <Navigate to={"/login"} />} />
        <Route path="/booking/:id" element={userToken ? <BookingPage /> : <Navigate to="/login" />} />

        {/* 🆕 Self Booking Routes */}
        <Route path="/self-booking/seats/:tempBusId" element={userToken ? <SelfBookingSeatSelection /> : <Navigate to="/login" />} />
        <Route path="/self-booking/payment/:tempBusId" element={userToken ? <SelfBookingPayment /> : <Navigate to="/login" />} />
        <Route path="/booking-success" element={userToken ? <BookingSuccess /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/owner/login" element={!adminToken ? <OwnerLogin /> : <Navigate to={"/owner"} />} />
        <Route path="/owner" element={adminToken ? <Layout /> : <Navigate to={"/owner/login"} />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-bus" element={<AddBus />} />
          <Route path="bus-list" element={<BusList />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="/owner/manage-users" element={<ManageUsers />} />
          <Route path="/owner/manage-messages" element={<ManageMessages />} />
        </Route>
      </Routes>
      
      {userToken && !isAdminPath && <Footer />}
      
      {/* 🆕 Floating Button - Bottom Right Fixed */}
      {showFloatingButton && (
        <FloatingCreateTripButton onClick={() => setShowSelfBooking(true)} />
      )}
      
      {/* 🆕 Self Booking Modal */}
      {showSelfBooking && (
        <SelfBookingForm onClose={() => setShowSelfBooking(false)} />
      )}
      
      <Toaster position="top-center" />
    </div>
  )
}

export default App