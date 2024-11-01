import { useEffect, useState } from "react";
import moment from "moment";
import { PlayerDoctorForm } from "./PlayerDoctorForm";
import { SearchPlayerId } from "./SearchPlayerID";
import { SearchDoctorId } from "./SearchDoctorId";

function PlayerDoctor() {
  const [data, setData] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null); // Track the player being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [selectedDoctorId, setSelectedDoctorId] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState(0);

  useEffect(() => {
    fetchPlayers();
  }, [selectedPlayerId, selectedDoctorId]);



  const fetchPlayers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/players/${selectedPlayerId}/doctors/${selectedDoctorId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch players');
      }
      const players = await res.json();
      setData(players);
      console.log(players);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player); // Set the player to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddPlayer = () => {
    console.log("Add Player button clicked");
    setEditingPlayer(null); // Clear editing player state for adding a new player
    setIsFormVisible(true); // Show the form
  };
  const handleDelete = async (player_id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        const res = await fetch(`http://localhost:5000/Players/${player_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete player');
        }

        console.log(`Player with ID ${player_id} deleted successfully`);
        fetchPlayers(); // Refresh player list after deletion
      } catch (err) {
        console.error("Error deleting player:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingPlayer(null); // Clear the editing player state
  };

  const handleFormSubmit = async () => {
    await fetchPlayers(); // Refresh player list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Player - Doctor
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddPlayer}
        >
          Add Player
        </button>
      </div>
      <div className = "px-32 flex gap-3">
        <SearchPlayerId
        
        selectedDoctorId={selectedDoctorId} // Pass down selected doctor ID
        setSelectedDoctorId={setSelectedDoctorId} // Pass down function to update doctor ID
        selectedPlayerId={selectedPlayerId} // Pass down selected doctor ID
        setSelectedPlayerId={setSelectedPlayerId} // Pass down function to update doctor ID
        />
        <SearchDoctorId
        selectedDoctorId={selectedDoctorId} // Pass down selected doctor ID
        setSelectedDoctorId={setSelectedDoctorId} // Pass down function to update doctor ID
        selectedPlayerId={selectedPlayerId} // Pass down selected doctor ID
        setSelectedPlayerId={setSelectedPlayerId} // Pass down function to update doctor ID
        />

       

        
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <div className="overflow-y-auto max-h-96">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-primary font-semibold px-4 py-3"></th>
                    <th className="text-primary font-semibold px-4 py-3">Player Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Sport</th>
                    <th className="text-primary font-semibold px-4 py-3">Age</th>
                    <th className="text-primary font-semibold px-4 py-3">Doctor Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((player, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{player.player_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{player.p_f_name} {player.p_l_name}</td>
                      <td className="px-4 py-3 text-gray-600">{player.sport}</td>
                      <td className="px-4 py-3 text-gray-600">{player.age}</td>
                      <td className="px-4 py-3 text-gray-600">{player.first_name} {player.last_name}</td>
                      <td className="px-4 py-3 text-gray-600">{player.specialization}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(player)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(player.player_id)} // Call delete function
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

      <h1>doc:{selectedDoctorId} player:{selectedPlayerId}</h1>

      {isFormVisible && (
        <PlayerDoctorForm
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default PlayerDoctor;
