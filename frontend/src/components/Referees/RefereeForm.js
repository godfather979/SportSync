// RefereeForm.js
import React, { useState } from 'react';

export function RefereeForm({ onClose, onSubmit, referee = {} }) {
    const [refereeData, setRefereeData] = useState({
        referee_id: referee?.referee_id || '',
        first_name: referee?.first_name || '',
        last_name: referee?.last_name || '',
        experience: referee?.experience || '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(referee?.referee_id);

    const handleChange = (e) => {
        setRefereeData({ ...refereeData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Referee' : 'Add New Referee'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={refereeData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={refereeData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="experience"
                        placeholder="Experience"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={refereeData.experience}
                        onChange={handleChange}
                    />
                    
                  

                    {error && <div className="text-red-500">{error}</div>}

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
