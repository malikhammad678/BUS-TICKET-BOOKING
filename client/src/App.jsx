import { Navigate, Route, Routes, useLocation } from "react-router-dom"
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

const App = () => {
  const { adminToken,userToken  } = useAppContext()
  const location = useLocation()

  const isAdminPath = location.pathname.startsWith("/owner")

  return (
    <div>
      {userToken && !isAdminPath && <Navbar />}
      <Routes>
      
        <Route path="/login" element={!userToken ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/" element={userToken ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/about" element={userToken ? <About /> : <Navigate to={"/login"} />} />
        <Route path="/buses" element={userToken ? <Buses /> : <Navigate to={"/login"} />} />
        <Route path="/contact" element={userToken ? <Contact /> : <Navigate to={"/login"} />} />
        <Route path="/my-bookings" element={userToken ? <MyBookings /> : <Navigate to={"/login"} />} />
        <Route path="/booking/:id" element={userToken ? <BookingPage /> : <Navigate to="/login" />} />

        <Route path="/owner/login" element={ !adminToken ?  <OwnerLogin /> : <Navigate to={"/owner"} />} />
        <Route path="/owner" element={ adminToken ? <Layout /> : <Navigate to={"/owner/login"} />}>
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
      <Toaster />
    </div>
  )
}

export default App