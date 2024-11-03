import { useEffect, useState } from "react";
import { Sports_FederationsForm } from './Sports_FederationsForm';

function Sports_Federations() {
  const [data, setData] = useState([]);
  const [editingFederation, setEditingFederation] = useState(null); // Track the federation being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchFederations();
  }, []);

  const fetchFederations = async () => {
    try {
      const res = await fetch('http://localhost:5000/sports_federations');
      const federations = await res.json();
      setData(federations);
    } catch (err) {
      console.error("Error fetching federations:", err);
    }
  };

  const handleEdit = (federation) => {
    setEditingFederation(federation); // Set the federation to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddFederation = () => {
    setEditingFederation(null); // Clear editing federation state for adding a new federation
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (federation_id) => {
    if (window.confirm("Are you sure you want to delete this federation?")) {
      try {
        const res = await fetch(`http://localhost:5000/sports_federations/${federation_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete federation');
        }

        console.log(`Federation with ID ${federation_id} deleted successfully`);
        fetchFederations(); // Refresh federation list after deletion
      } catch (err) {
        console.error("Error deleting federation:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingFederation(null); // Clear the editing federation state
  };

  const handleFormSubmit = async () => {
    await fetchFederations(); // Refresh federation list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Sports Federations
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddFederation}
        >
          Add Federation
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
                    <th className="text-primary font-semibold px-4 py-3">Federation Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Country</th>
                    <th className="text-primary font-semibold px-4 py-3">Contact Number</th>
                    <th className="text-primary font-semibold px-4 py-3">Email</th>
                    <th className="text-primary font-semibold px-4 py-3">Established Year</th>
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((federation, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{federation.federation_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{federation.federation_name}</td>
                      <td className="px-4 py-3 text-gray-600">{federation.country}</td>
                      <td className="px-4 py-3 text-gray-600">{federation.contact_number}</td>
                      <td className="px-4 py-3 text-gray-600">{federation.email}</td>
                      <td className="px-4 py-3 text-gray-600">{federation.established_year}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(federation)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(federation.federation_id)}
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
        <Sports_FederationsForm
          federation={editingFederation} // Pass null if adding a new federation
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Sports_Federations;
