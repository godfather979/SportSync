import React, { useState } from 'react';
import moment from 'moment';

export function FanForm({ onClose, onSubmit, fan = {} }) {
    const [fanData, setFanData] = useState({
        fan_id: fan?.fan_id || '', // Use optional chaining
        first_name: fan?.first_name || '',
        last_name: fan?.last_name || '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(fan?.fan_id); // Use optional chaining

    const handleChange = (e) => {
        setFanData({ ...fanData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} fan data:`, fanData);

        try {
            const response = await fetch(
                `http://localhost:5000/Fans${isEditMode ? `/${fan.fan_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST', // Use PUT for edit, POST for new fan
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fanData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save fan data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Fan updated' : 'Fan added'} successfully:`, result);
            setFanData({ fan_id: '', first_name: '', last_name: '' }); // Reset form on success
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
                    {isEditMode ? 'Edit Fan' : 'Add New Fan'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <input
                        type="text"
                        name="fan_id"
                        placeholder="Fan ID"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={fanData.fan_id}
                        onChange={handleChange}
                        required
                        disabled={isEditMode} // Disable ID input for edit mode
                    /> */}
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={fanData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={fanData.last_name}
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
