// RefereeForm.js
import React, { useState } from 'react';

export function RefereeForm({ onClose, onSubmit, referee = {} }) {
    const [refereeData, setRefereeData] = useState({
        referee_id: referee?.referee_id || '',
        first_name: referee?.first_name || '',
        last_name: referee?.last_name || '',
        experience: referee?.experience || '',
    });

    const [error, setError] = useState({
        first_name: '',
        last_name: '',
        experience: '',
    });

    const isEditMode = Boolean(referee?.referee_id);

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
        }

        setRefereeData({ ...refereeData, [name]: value });
        setError({ ...error, [name]: errorMessage });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(error).some(err => err !== '');
        if (hasErrors) {
            setError({
                first_name: error.first_name || '',
                last_name: error.last_name || '',
                experience: error.experience || '',
            });
            return;
        }
        setError({
            first_name: '',
            last_name: '',
            experience: '',
        });

        console.log(`${isEditMode ? 'Updating' : 'Adding'} referee data:`, refereeData);

        try {
            const response = await fetch(
                `http://localhost:5000/Referees${isEditMode ? `/${referee.referee_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(refereeData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save referee data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Referee updated' : 'Referee added'} successfully:`, result);
            setRefereeData({ referee_id: '', first_name: '', last_name: '', experience: '' });
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
                    {isEditMode ? 'Edit Referee' : 'Add New Referee'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={refereeData.first_name}
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
                            value={refereeData.last_name}
                            onChange={handleChange}
                            required
                        />
                        {error.last_name && <div className="text-red-500">{error.last_name}</div>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="experience"
                            placeholder="Experience"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={refereeData.experience}
                            onChange={handleChange}
                            required
                        />
                        {error.experience && <div className="text-red-500">{error.experience}</div>}
                    </div>

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
