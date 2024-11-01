import { useEffect, useState } from "react";
import moment from 'moment';

function Matches() {
  const [data, setData] = useState([]);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/Matches");
      const matches = await res.json();
      setData(matches);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  const handleEdit = (match) => {
    setEditingInstitute(match);
    setIsFormVisible(true);
  };

  const handleAddInstitute = () => {
    setEditingInstitute(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (institute_id) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        const res = await fetch(`http://localhost:5000/Institutes/${institute_id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete match");

        fetchMatches();
      } catch (err) {
        console.error("Error deleting match:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    setEditingInstitute(null);
  };

  const handleFormSubmit = async () => {
    await fetchMatches();
    handleClose();
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold flex-grow text-center">Matches</h2>
        <button className="btn btn-primary" onClick={handleAddInstitute}>
          Add Match
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th>ID</th>
                  <th>Player 1</th>
                  <th>Age</th>
                  <th>Player 2</th>
                  <th>Age</th>
                  <th>Referee</th>
                  <th>Location</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((match) => (
                  <tr key={match.match_id} className="hover:bg-gray-200">
                    <td>{match.match_id}</td>
                    <td>{match.player1_f_name} {match.player1_l_name}</td>
                    <td>{match.player1age}</td>
                    <td>{match.player2_f_name} {match.player2_l_name}</td>
                    <td>{match.player1age}</td>
                    <td>{match.referee_f_name} {match.referee_l_name}</td>
                    <td>{match.facility_name}</td>
                    <td>{match.facility_location}</td>
                    <td >
                        {moment(match.date).format("DD/MM/YYYY")}
                      </td>
                    
                    
                    <td>
                      <button className="btn btn-ghost" onClick={() => handleEdit(match)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost text-red-600"
                        onClick={() => handleDelete(match.institute_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* {isFormVisible && (
        <InstituteForm
          match={editingInstitute}
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )} */}
    </div>
  );
}

export default Matches;
