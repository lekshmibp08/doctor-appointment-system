import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { IAppointment } from '../types/interfaces';
import { format } from "date-fns";

const UserAppointmentTable: React.FC = () => {

  const { currentUser } = useSelector((state: RootState) => state.userAuth);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);


  const fetchAppointments = async () => {
    const userId = currentUser?._id;
    try {
        const response = await axios.get(`/api/users/appointments/${userId}`);
        setAppointments(response.data); 
        
    } catch (error) {
        console.error(error);        
    }
  };

  useEffect(() => {
    fetchAppointments();
  },[]);

  const handleCancelAppointment = (appoinmentId: string) => {
    console.log("Button Clicked", appoinmentId);
    

  }

  return (
    <div className="p-4 mx-auto max-w-6xl bg-lightTeal rounded-md">
      {/* Add responsive scrollable container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead className="bg-customTeal text-white">
            <tr>
              <th className="p-2 border border-gray-300">Sl. No</th>
              <th className="p-2 border border-gray-300">Booking Date</th>
              <th className="p-2 border border-gray-300">Slot</th>
              <th className="p-2 border border-gray-300">Status</th>
              <th className="p-2 border border-gray-300">Ticket</th>
              <th className="p-2 border border-gray-300">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  } text-center`}
                >
                  <td className="p-2 border border-gray-300">{index+1}</td>
                  <td className="p-2 border border-gray-300"> 
                    {format(new Date(appointment.date), 'dd MMM yyyy, EEEE')}
                  </td>
                  <td className="p-2 border border-gray-300">{appointment.time}</td>
                  <td className="p-2 border border-gray-300">
                    { appointment.isCompleted ? "Completed" : "Pending" }
                  </td>
                  <td className="p-2 border border-gray-300">
                    <button className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs md:text-sm">
                      Open
                    </button>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {appointment.isCancelled ? (
                      <span className="text-red-500 font-semibold">Cancelled</span>
                    ) : (
                      <button
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs md:text-sm"
                        onClick={() => handleCancelAppointment(appointment._id)} // Add your cancel logic here
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No appointments available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAppointmentTable;
