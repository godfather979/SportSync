import { useEffect, useState } from "react";
import { EventForm } from './EventForm'; // Ensure this imports your form component

function Events() {
  const [data, setData] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null); // Track the event being edited
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/Events');
      const events = await res.json();
      setData(events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event); // Set the event to be edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleAddEvent = () => {
    setEditingEvent(null); // Clear editing event state for adding a new event
    setIsFormVisible(true); // Show the form
  };

  const handleDelete = async (event_id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`http://localhost:5000/Events/${event_id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to delete event');
        }

        console.log(`Event with ID ${event_id} deleted successfully`);
        fetchEvents(); // Refresh event list after deletion
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handleClose = () => {
    setIsFormVisible(false); // Hide the form
    setEditingEvent(null); // Clear the editing event state
  };

  const handleFormSubmit = async () => {
    await fetchEvents(); // Refresh event list after adding/editing
    handleClose(); // Close the form
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">Events</h2>
        <button
          className="btn btn-primary hover:shadow-lg transition-shadow"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <div className="card-body p-6">
            <div className="overflow-y-auto max-h-96">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-primary font-semibold px-4 py-3">Event ID</th>
                    <th className="text-primary font-semibold px-4 py-3">Event Name</th>
                    <th className="text-primary font-semibold px-4 py-3">Event Date</th>
                    <th className="text-primary font-semibold px-4 py-3">Location</th>
                    <th className="text-primary font-semibold px-4 py-3">Description</th>
                    <th className="text-primary font-semibold px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((event) => (
                    <tr key={event.event_id} className="hover:bg-gray-200 transition-colors border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-600">{event.event_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{event.event_name}</td>
                      <td className="px-4 py-3 text-gray-600">
  {new Date(event.event_date).toLocaleDateString('en-GB')} {/* Format date to DD/MM/YYYY */}
</td>
                      <td className="px-4 py-3 text-gray-600">{event.location}</td>
                      <td className="px-4 py-3 text-gray-600">{event.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-xs hover:bg-primary/10"
                            onClick={() => handleEdit(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-red-600 hover:bg-red-200"
                            onClick={() => handleDelete(event.event_id)} // Call delete function
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
        <EventForm
          event={editingEvent} // Pass null if adding a new event
          onClose={handleClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Events;
