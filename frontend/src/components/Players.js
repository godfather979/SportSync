import { useEffect, useState } from "react";
import moment from "moment";
import { PlayerForm } from './PlayerForm';


function Players() {

    const[data,setData] = useState([]);
    const [editingPlayer, setEditingPlayer] = useState(null);   // Track the player being edited
    const [isFormVisible, setIsFormVisible] = useState(false);  // Toggle form visibility

    useEffect(() => {
      fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
      try {
          const res = await fetch('http://localhost:5000/Players');
          const players = await res.json();
          setData(players);
      } catch (err) {
          console.error("Error fetching players:", err);
      }
  };

    const handleEdit = (player) => {
      setEditingPlayer(player); // Set the player to be edited
      setIsFormVisible(true); // Show the form for editing
  };

    const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingPlayer(null); // Clear the editing player state
  };

  const handleFormSubmit = async () => {
    await fetchPlayers(); // Refresh player list after editing
    handleClose(); // Close the form
  };


    
    
    return (
        <>
        <div className = "p-5">
            <div className = "text-center font-bold text-lg py-3">Players</div>
            <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>ID</th>
        <th>Name</th>
        <th>Sport</th>
        <th>Date of Birth</th>
      </tr>
    </thead>
    <tbody>
      {data.map((d,i) => (
        <tr key = {i} className = "hover">
            <td></td>
            <td>{d.player_id}</td>
            <td>{d.name}</td>
            <td>{d.sport}</td>
            <td>{moment(d.dob).format("DD/MM/YYYY")}</td>
            <td>
            <button className = "text-white text-center" onClick={() => handleEdit(d)}>Edit</button>
            </td>
            
        </tr>

      ))}
      
    </tbody>
  </table>
</div>

{/* Render PlayerForm for editing */}
{isFormVisible && (
                <PlayerForm
                    player={editingPlayer} // Pass the player to be edited
                    onClose={handleClose}
                    onSubmit={handleFormSubmit}
                />
            )}
</div>
        </>
        
    );
}

export default Players;
