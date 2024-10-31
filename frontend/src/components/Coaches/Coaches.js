import { useEffect, useState } from "react";
import { CoachForm } from './CoachForm';

function Coaches() {
  const [data, setData] = useState([]);
  const [editingCoach, setEditingCoach] = useState(null); // Track the coach being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await fetch('http://localhost:5000/Coaches');
      const coaches = await res.json();
      setData(coaches);
    } catch (err) {
      console.error("Error fetching coaches:", err);
    }
  };

  const handleEdit = (coach) => {
    setEditingCoach(coach); // Set the coach to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddCoach = () => {
    setEditingCoach(null); // Clear editing coach state for adding a new coach
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (coach_id) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      try {
        const res = await fetch(`http://localhost:5000/Coaches/${coach_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete coach');
        }

        console.log(`Coach with ID ${coach_id} deleted successfully`);
        fetchCoaches(); // Refresh coach list after deletion
      } catch (err) {
        console.error("Error deleting coach:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingCoach(null); // Clear the editing coach state
  };

  const handleFormSubmit = async () => {
    await fetchCoaches(); // Refresh coach list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Coaches
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddCoach}
        >
          Add Coach
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
                    <th className="text-primary font-semibold px-4 py-3">Experience (Years)</th>
                    <th className="text-primary font-semibold px-4 py-3">Sport</th> {/* Added Sport Column */}
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((coach, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{coach.coach_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {coach.first_name} {coach.last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{coach.experience}</td>
                      <td className="px-4 py-3 text-gray-600">{coach.sport}</td> {/* Display Sport Data */}
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(coach)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(coach.coach_id)} // Call delete function
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
        <CoachForm
          coach={editingCoach} // Pass null if adding a new coach
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Coaches;
