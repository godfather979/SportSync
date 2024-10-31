import { useEffect, useState } from "react";
import moment from "moment";
import { Media_BroadcastersForm } from './Media_BroadcastersForm'; // Assuming you have a form component for broadcasters

function Media_Broadcasters() {
  const [data, setData] = useState([]);
  const [editingBroadcaster, setEditingBroadcaster] = useState(null); // Track the broadcaster being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchBroadcasters();
  }, []);

  const fetchBroadcasters = async () => {
    try {
      const res = await fetch('http://localhost:5000/media_broadcasters'); // Adjusted API endpoint
      const broadcasters = await res.json();
      setData(broadcasters);
    } catch (err) {
      console.error("Error fetching broadcasters:", err);
    }
  };

  const handleEdit = (broadcaster) => {
    setEditingBroadcaster(broadcaster); // Set the broadcaster to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddBroadcaster = () => {
    console.log("Add Broadcaster button clicked");
    setEditingBroadcaster(null); // Clear editing broadcaster state for adding a new broadcaster
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (broadcaster_id) => {
    if (window.confirm("Are you sure you want to delete this broadcaster?")) {
      try {
        const res = await fetch(`http://localhost:5000/media_broadcasters/${broadcaster_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete broadcaster');
        }

        console.log(`Broadcaster with ID ${broadcaster_id} deleted successfully`);
        fetchBroadcasters(); // Refresh broadcaster list after deletion
      } catch (err) {
        console.error("Error deleting broadcaster:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingBroadcaster(null); // Clear the editing broadcaster state
  };

  const handleFormSubmit = async () => {
    await fetchBroadcasters(); // Refresh broadcaster list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Media Broadcasters
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddBroadcaster}
        >
          Add Broadcaster
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
                    <th className="text-primary font-semibold px-4 py-3">City</th>
                    <th className="text-primary font-semibold px-4 py-3">Monthly Viewers</th>
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((broadcaster, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{broadcaster.broadcaster_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{broadcaster.broadcaster_name}</td>
                      <td className="px-4 py-3 text-gray-600">{broadcaster.city}</td>
                      <td className="px-4 py-3 text-gray-600">{broadcaster.monthly_viewers}</td>
                
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(broadcaster)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(broadcaster.broadcaster_id)} // Call delete function
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
        <Media_BroadcastersForm
          broadcaster={editingBroadcaster} // Pass null if adding a new broadcaster
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Media_Broadcasters;
