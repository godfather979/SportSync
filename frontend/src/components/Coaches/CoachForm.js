import React, { useState } from 'react';

export function CoachForm({ onClose, onSubmit, coach = {} }) {
    const [coachData, setCoachData] = useState({
        coach_id: coach?.coach_id || '',
        first_name: coach?.first_name || '',
        last_name: coach?.last_name || '',
        experience: coach?.experience || '',
        sport: coach?.sport || ''
    });

    const [error, setError] = useState({
        first_name: '',
        last_name: '',
        experience: '',
        sport: '',
        general: ''
    });
    const isEditMode = Boolean(coach?.coach_id);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        // Validate inputs based on field name
        if (name === 'first_name' || name === 'last_name') {
            if (!/^[a-zA-Z]*$/.test(value) && value !== '') {
                errorMessage = 'Only alphabetic characters are allowed.';
            }
        } else if (name === 'experience') {
            if (!/^\d*$/.test(value) && value !== '') {
                errorMessage = 'Only numeric values are allowed.';
            }
        } else if (name === 'sport') {
            if (!/^[a-zA-Z\s]*$/.test(value) && value !== '') {
                errorMessage = 'Only alphabetic characters are allowed.';
            }
        }

        setCoachData({ ...coachData, [name]: value });
        setError({ ...error, [name]: errorMessage });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(error).some(err => err !== '');
        if (hasErrors) {
            return; // Prevent form submission if there are errors
        }

        console.log(`${isEditMode ? 'Updating' : 'Adding'} coach data:`, coachData);

        try {
            const response = await fetch(
                `http://localhost:5000/Coaches${isEditMode ? `/${coach.coach_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
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
            setCoachData({ coach_id: '', first_name: '', last_name: '', experience: '', sport: '' });
            setError({ first_name: '', last_name: '', experience: '', sport: '', general: '' }); // Reset errors on success
            onSubmit();
        } catch (err) {
            console.error('Error:', err);
            setError({ ...error, general: err.message || 'An unexpected error occurred' });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Coach' : 'Add New Coach'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={coachData.first_name}
                            onChange={handleChange}
                            required
                        />
                        {error.first_name && <div className="text-red-500">{error.first_name}</div>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={coachData.last_name}
                            onChange={handleChange}
                            required
                        />
                        {error.last_name && <div className="text-red-500">{error.last_name}</div>}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="experience"
                            placeholder="Years of Experience"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={coachData.experience}
                            onChange={handleChange}
                            required
                        />
                        {error.experience && <div className="text-red-500">{error.experience}</div>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="sport"
                            placeholder="Sport"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={coachData.sport}
                            onChange={handleChange}
                            required
                        />
                        {error.sport && <div className="text-red-500">{error.sport}</div>}
                    </div>

                    {error.general && <div className="text-red-500">{error.general}</div>}

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
