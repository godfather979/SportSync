// Doctors.js
import { useEffect, useState } from "react";
import { DoctorForm } from './DoctorForm';

function Doctors() {
  const [data, setData] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5000/Doctors');
      const doctors = await res.json();
      setData(doctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setIsFormVisible(true);
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (doctor_id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const res = await fetch(`http://localhost:5000/Doctors/${doctor_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete doctor');
        }

        console.log(`Doctor with ID ${doctor_id} deleted successfully`);
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    setEditingDoctor(null);
  };

  const handleFormSubmit = async () => {
    await fetchDoctors();
    handleClose();
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Doctors
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddDoctor}
        >
          Add Doctor
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <div className="overflow-y-auto max-h-96">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-primary font-semibold px-4 py-3">ID</th>
                    <th className="text-primary font-semibold px-4 py-3">Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Specialization</th>
                    <th className="text-primary font-semibold px-4 py-3">Institute ID</th>
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((doctor) => (
                    <tr
                      key={doctor.doctor_id}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{doctor.doctor_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{doctor.first_name} {doctor.last_name}</td>
                      <td className="px-4 py-3 text-gray-600">{doctor.specialization}</td>
                      <td className="px-4 py-3 text-gray-600">{doctor.institute_id}</td>
                          
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(doctor)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(doctor.doctor_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isFormVisible && (
        <DoctorForm
          onClose={handleClose}
          onSubmit={handleFormSubmit}
          doctor={editingDoctor}
        />
      )}
    </div>
  );
}

export default Doctors;
