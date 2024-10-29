import { useEffect, useState } from "react";
import moment from "moment";
import { FanForm } from "./FanForm";

function Fans() {
  const [data, setData] = useState([]);
  const [editingFan, setEditingFan] = useState(null); // Track the fan being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchFans();
  }, []);

  const fetchFans = async () => {
    try {
      const res = await fetch('http://localhost:5000/Fans');
      const fans = await res.json();
      setData(fans);
    } catch (err) {
      console.error("Error fetching fans:", err);
    }
  };

  const handleEdit = (fan) => {
    setEditingFan(fan); // Set the fan to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddFan = () => {
    console.log("Add Fan button clicked");
    setEditingFan(null); // Clear editing fan state for adding a new fan
    setIsFormVisible(true); // Show the form
  };
  const handleDelete = async (fan_id) => {
    if (window.confirm("Are you sure you want to delete this fan?")) {
      try {
        const res = await fetch(`http://localhost:5000/Fans/${fan_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete fan');
        }

        console.log(`Fan with ID ${fan_id} deleted successfully`);
        fetchFans(); // Refresh fan list after deletion
      } catch (err) {
        console.error("Error deleting fan:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingFan(null); // Clear the editing fan state
  };

  const handleFormSubmit = async () => {
    await fetchFans(); // Refresh fan list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Fans
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddFan}
        >
          Add Fan
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
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((fan, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{fan.fan_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{fan.first_name} {fan.last_name}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(fan)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(fan.fan_id)} // Call delete function
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
        <FanForm
          fan={editingFan} // Pass null if adding a new fan
          onClose={handleClose}
          onSubmit={handleFormSubmit}
          //isEditing={Boolean(editingFan)} // Pass a flag to check if editing
        />
      )}
    </div>
  );
}

export default Fans;
