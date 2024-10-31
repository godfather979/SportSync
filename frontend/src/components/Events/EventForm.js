import React, { useState } from 'react';
import moment from 'moment';

export function EventForm({ onClose, onSubmit, event = {} }) {
    const [eventData, setEventData] = useState({
        event_id: event?.event_id || '', // Use optional chaining
        event_name: event?.event_name || '',
        event_date: event?.event_date ? moment(event.event_date).format('YYYY-MM-DD') : '',
        location: event?.location || '',
        description: event?.description || '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(event?.event_id); // Use optional chaining

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} event data:`, eventData);

        try {
            const response = await fetch(
                `http://localhost:5000/Events${isEditMode ? `/${event.event_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST', // Use PUT for edit, POST for new event
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save event data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Event updated' : 'Event added'} successfully:`, result);
            setEventData({ event_id: '', event_name: '', event_date: '', location: '', description: '' }); // Reset form on success
            onSubmit(); // Notify parent component of success
        } catch (err) {
            console.error('Error:', err); // Log the full error object
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[500px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Event' : 'Add New Event'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="event_name"
                        placeholder="Event Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={eventData.event_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="event_date"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={eventData.event_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={eventData.location}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={eventData.description}
                        onChange={handleChange}
                        required
                    />

                    {error && <div className="text-red-500">{error}</div>} {/* Display error message */}

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditMode ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
