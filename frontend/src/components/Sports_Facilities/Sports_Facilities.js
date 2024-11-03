import { useEffect, useState } from "react";
import moment from "moment";
import { Sports_FacilitiesForm } from './Sports_FacilitiesForm';

function Sports_Facilities() {
  const [data, setData] = useState([]);
  const [editingFacility, setEditingFacility] = useState(null); // Track the facility being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await fetch('http://localhost:5000/Sports_Facilities');
      const facilities = await res.json();
      setData(facilities);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  const handleEdit = (facility) => {
    setEditingFacility(facility); // Set the facility to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddFacility = () => {
    console.log("Add Facility button clicked");
    setEditingFacility(null); // Clear editing facility state for adding a new facility
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (facility_id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        const res = await fetch(`http://localhost:5000/Facilities/${facility_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete facility');
        }

        console.log(`Facility with ID ${facility_id} deleted successfully`);
        fetchFacilities(); // Refresh facilities list after deletion
      } catch (err) {
        console.error("Error deleting facility:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingFacility(null); // Clear the editing facility state
  };

  const handleFormSubmit = async () => {
    await fetchFacilities(); // Refresh facilities list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Sports Facilities
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddFacility}
        >
          Add Facility
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
                    <th className="text-primary font-semibold px-4 py-3">Facility Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Location</th>
                    <th className="text-primary font-semibold px-4 py-3">Capacity</th>
                    <th className="text-primary font-semibold px-4 py-3">Facility Type</th>
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((facility, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{facility.facility_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{facility.facility_name}</td>
                      <td className="px-4 py-3 text-gray-600">{facility.location}</td>
                      <td className="px-4 py-3 text-gray-600">{facility.capacity}</td>
                      <td className="px-4 py-3 text-gray-600">{facility.facility_type}</td>
                      
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(facility)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(facility.facility_id)}
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
        <Sports_FacilitiesForm
          facility={editingFacility} // Pass null if adding a new facility
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Sports_Facilities;
