import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">

      <div className="fixed top-0 left-0 right-0 z-50 px-5">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-[65px] h-screen">

        <div className="fixed left-0 top-[65px] bottom-0 z-40">
          <Sidebar />
        </div>

        <main className="ml-64 flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default Layout