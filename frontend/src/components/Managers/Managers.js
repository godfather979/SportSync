import React, { useEffect, useState } from 'react';
import ManagerForm from './ManagerForm'; // Import the ManagerForm component

function Manager() {
  const [data, setData] = useState([]); // State for storing manager data
  const [editingManager, setEditingManager] = useState(null); // State for the manager being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

  useEffect(() => {
    fetchManagers(); // Fetch managers when the component mounts
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await fetch('http://localhost:5000/managers'); // Adjust the endpoint if needed
      const managers = await res.json();
      setData(managers); // Update state with fetched managers
    } catch (err) {
      console.error('Error fetching managers:', err);
    }
  };

  const handleEdit = (manager) => {
    setEditingManager(manager); // Set the manager to edit
    setIsFormVisible(true); // Show the form
  };

  const handleAddManager = () => {
    setEditingManager(null); // Reset editing state for a new manager
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (manager_id) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      try {
        const res = await fetch(`http://localhost:5000/managers/${manager_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete manager');

        fetchManagers(); // Refresh the list after deletion
      } catch (err) {
        console.error('Error deleting manager:', err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingManager(null); // Reset the editing manager
  };

  const handleFormSubmit = async () => {
    await fetchManagers(); // Fetch the updated list of managers
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold flex-grow text-center">Managers</h2>
        <button className="btn btn-primary" onClick={handleAddManager}>
          Add Manager
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                 
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((manager) => (
                  <tr key={manager.manager_id} className="hover:bg-gray-200">
                    <td>{manager.manager_id}</td>
                    <td>{manager.first_name}</td>
                    <td>{manager.last_name}</td>
                   
                    <td>
                      <button className="btn btn-ghost" onClick={() => handleEdit(manager)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost text-red-600"
                        onClick={() => handleDelete(manager.manager_id)}
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
        <ManagerForm
          manager={editingManager}
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Manager;
