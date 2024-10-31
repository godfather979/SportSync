import React, { useState } from 'react';

export function CoachForm({ onClose, onSubmit, coach = {} }) {
    const [coachData, setCoachData] = useState({
        coach_id: coach?.coach_id || '', // Use optional chaining
        first_name: coach?.first_name || '',
        last_name: coach?.last_name || '',
        experience: coach?.experience || '', // Changed to experience
        sport: coach?.sport || '' // Add sport field
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(coach?.coach_id); // Use optional chaining

    const handleChange = (e) => {
        setCoachData({ ...coachData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} coach data:`, coachData);

        try {
            const response = await fetch(
                `http://localhost:5000/Coaches${isEditMode ? `/${coach.coach_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST', // Use PUT for edit, POST for new coach
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(coachData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save coach data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Coach updated' : 'Coach added'} successfully:`, result);
            setCoachData({ coach_id: '', first_name: '', last_name: '', experience: '', sport: '' }); // Reset form on success
            onSubmit(); // Notify parent component of success
        } catch (err) {
            console.error('Error:', err); // Log the full error object
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Coach' : 'Add New Coach'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={coachData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={coachData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="experience"
                        placeholder="Years of Experience"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={coachData.experience}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="sport"
                        placeholder="Sport"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={coachData.sport}
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
