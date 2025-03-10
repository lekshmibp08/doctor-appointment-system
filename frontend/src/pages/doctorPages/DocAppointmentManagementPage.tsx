import { useState } from "react";
import { useSelector } from "react-redux";
import DoctorSidebar from "../../components/DoctorSidebar";
import UserHeader from "../../components/UserHeader";
import Footer from "../../components/Footer";
import DocAppointmentTable from "../../components/DocAppointmentTable";
import { RootState } from "../../Redux/store";


const DocAppointmentManagementPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.doctorAuth.currentUser);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <UserHeader role="doctor" onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          < DocAppointmentTable doctorId = {currentUser?._id || ""} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DocAppointmentManagementPage;











