// Referees.js
import { useEffect, useState } from "react";
import { RefereeForm } from "./RefereeForm";

function Referees() {
  const [data, setData] = useState([]);
  const [editingReferee, setEditingReferee] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchReferees();
  }, []);

  const fetchReferees = async () => {
    try {
      const res = await fetch('http://localhost:5000/Referees');
      const referees = await res.json();
      setData(referees);
    } catch (err) {
      console.error("Error fetching referees:", err);
    }
  };

  const handleEdit = (referee) => {
    setEditingReferee(referee);
    setIsFormVisible(true);
  };

  const handleAddReferee = () => {
    setEditingReferee(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (referee_id) => {
    if (window.confirm("Are you sure you want to delete this referee?")) {
      try {
        const res = await fetch(`http://localhost:5000/Referees/${referee_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete referee');
        }

        console.log(`Referee with ID ${referee_id} deleted successfully`);
        fetchReferees();
      } catch (err) {
        console.error("Error deleting referee:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    setEditingReferee(null);
  };

  const handleFormSubmit = async () => {
    await fetchReferees();
    handleClose();
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Referees
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddReferee}
        >
          Add Referee
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

                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((referee) => (
                    <tr
                      key={referee.referee_id}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{referee.referee_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{referee.first_name} {referee.last_name}</td>
                      <td className="px-4 py-3 text-gray-600">{referee.experience}</td>
                          
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(referee)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(referee.referee_id)}
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
        <RefereeForm
          onClose={handleClose}
          onSubmit={handleFormSubmit}
          referee={editingReferee}
        />
      )}
    </div>
  );
}

export default Referees;
