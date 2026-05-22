import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-5">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-[57px] sm:pt-[65px] h-screen">

        {/* Desktop Sidebar — fixed */}
        <div className="hidden md:block fixed left-0 top-[57px] sm:top-[65px] bottom-0 z-40">
          <Sidebar />
        </div>

        {/* Main Content */}
        {/* md: margin-left matches sidebar width | mobile: no margin, padding-bottom for bottom nav */}
        <main className="flex-1 md:ml-56 lg:ml-64 overflow-y-auto bg-gray-50 p-4 sm:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

      </div>

      {/* Mobile Bottom Nav rendered inside Sidebar component */}
      <Sidebar />

    </div>
  )
}

export default Layout