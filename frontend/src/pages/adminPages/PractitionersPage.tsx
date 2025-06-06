import { useState } from 'react'
import AdminHeader from '../../components/AdminHeader'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import PractitionersList from '../../components/PractitionersList'

const PractitionersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };    
  return (<>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
            <PractitionersList/>  
        </div>
      </div>
      <Footer />
  </>)
}

export default PractitionersPage
