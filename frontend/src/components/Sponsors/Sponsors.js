import { useEffect, useState } from "react";
import moment from "moment";

import { SponsorForm } from "./SponsorForm";

function Sponsors() {
  const [data, setData] = useState([]);
  const [editingSponsor, setEditingSponsor] = useState(null); // Track the sponsor being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('http://localhost:5000/Sponsors');
      const sponsors = await res.json();
      setData(sponsors);
      console.log(sponsors)
    } catch (err) {
      console.error("Error fetching sponsors:", err);
    }
  };

  const handleEdit = (sponsor) => {
    setEditingSponsor(sponsor); // Set the sponsor to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddSponsor = () => {
    console.log("Add Sponsor button clicked");
    setEditingSponsor(null); // Clear editing sponsor state for adding a new sponsor
    setIsFormVisible(true); // Show the form
  };
  const handleDelete = async (sponsor_id) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      try {
        const res = await fetch(`http://localhost:5000/Sponsors/${sponsor_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete sponsor');
        }

        console.log(`Sponsor with ID ${sponsor_id} deleted successfully`);
        fetchSponsors(); // Refresh sponsor list after deletion
      } catch (err) {
        console.error("Error deleting sponsor:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingSponsor(null); // Clear the editing sponsor state
  };

  const handleFormSubmit = async () => {
    await fetchSponsors(); // Refresh sponsor list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow text-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            Sponsors
          </h2>
        </div>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddSponsor}
        >
          Add Sponsor
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
                    <th className="text-primary font-semibold px-4 py-3">Amount</th>
                    
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((sponsor, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-gray-600">{sponsor.sponsor_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{sponsor.sponsor_name}</td>
                      <td className="px-4 py-3 text-gray-600">{sponsor.sponsorship_amount}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(sponsor)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(sponsor.sponsor_id)} // Call delete function
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
        <SponsorForm
          sponsor={editingSponsor} // Pass null if adding a new sponsor
          onClose={handleClose}
          onSubmit={handleFormSubmit}
          //isEditing={Boolean(editingSponsor)} // Pass a flag to check if editing
        />
      )}
    </div>
  );
}

export default Sponsors;
