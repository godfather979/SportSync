import { useEffect, useState } from "react";
import InstituteForm from "./InstituteForm";

function Institute() {
  const [data, setData] = useState([]);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const res = await fetch("http://localhost:5000/Institutes");
      const institutes = await res.json();
      setData(institutes);
    } catch (err) {
      console.error("Error fetching institutes:", err);
    }
  };

  const handleEdit = (institute) => {
    setEditingInstitute(institute);
    setIsFormVisible(true);
  };

  const handleAddInstitute = () => {
    setEditingInstitute(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (institute_id) => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        const res = await fetch(`http://localhost:5000/Institutes/${institute_id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete institute");

        fetchInstitutes();
      } catch (err) {
        console.error("Error deleting institute:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false);
    setEditingInstitute(null);
  };

  const handleFormSubmit = async () => {
    await fetchInstitutes();
    handleClose();
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold flex-grow text-center">Institutes</h2>
        <button className="btn btn-primary" onClick={handleAddInstitute}>
          Add Institute
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Ranking</th>
                  <th>Sports Type</th>
                  <th>Established Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((institute) => (
                  <tr key={institute.institute_id} className="hover:bg-gray-200">
                    <td>{institute.institute_id}</td>
                    <td>{institute.institute_name}</td>
                    <td>{institute.city}</td>
                    <td>{institute.ranking}</td>
                    <td>{institute.sports_type}</td>
                    <td>{institute.established_year}</td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => handleEdit(institute)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost text-red-600"
                        onClick={() => handleDelete(institute.institute_id)}
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

      {isFormVisible && (
        <InstituteForm
          institute={editingInstitute}
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Institute;
