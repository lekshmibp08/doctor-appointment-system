import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { IPractitioner } from '../types/interfaces';


const PractitionersList = () => {
  const [practitioners, setPractitioners] = useState<IPractitioner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/admin/doctors', {
          params: {
            page: currentPage,
            size: 8,
            search: search || "",
          },
        });

        setPractitioners(response.data.doctors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [currentPage, search]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

 

  const handleApproval = async (id: string) => {
    try {
        const response = await axios.patch(`/api/admin/doctors/approve/${id}`);
        const { isApproved } = response.data;

        setPractitioners((prev) =>
            prev.map((doctor) =>
              doctor._id === id ? { ...doctor, isApproved } : doctor
            )
          );        
        
    } catch (error: any) {
        console.error('Error blocking/unblocking doctor:', error);
    }
  }

  return (
    <div className="p-6 bg-customBgLight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Practitioners</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border">Reg. No</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-center border">Approve Updates</th>
            </tr>
          </thead>
          <tbody>
            {practitioners.map((practitioner) => (
              <tr key={practitioner._id} className="hover:bg-gray-100">
                <td className="p-3 border">{practitioner.registerNumber}</td>
                <td className="p-3 border">{practitioner.fullName}</td>
                <td className="p-3 border">{practitioner.email}</td>
                <td className="p-3 border font-semibold">{practitioner.mobileNumber}</td>
                <td className="p-3 text-center border">
                  <button onClick={() => handleApproval(practitioner._id)}
                    className={`${
                      practitioner.isApproved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 py-1 rounded transition`}
                  >
                    {practitioner.isApproved ? 'Block' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
            
    </div>
  );
};

export default PractitionersList;
