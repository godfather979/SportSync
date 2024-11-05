import React, { useState, useEffect } from 'react';

export function FanForm({ onClose, onSubmit, fan = {} }) {
    const [fanData, setFanData] = useState({
        fan_id: fan?.fan_id || '',
        first_name: fan?.first_name || '',
        last_name: fan?.last_name || '',
    });

    const [error, setError] = useState({});
    const isEditMode = Boolean(fan?.fan_id);

    useEffect(() => {
        if (fan) {
            setFanData({
                fan_id: fan.fan_id || '',
                first_name: fan.first_name || '',
                last_name: fan.last_name || '',
            });
        }
    }, [fan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFanData({ ...fanData, [name]: value });

        // Validate input on change
        validateInput(name, value);
    };

    const validateInput = (name, value) => {
        const regex = /^[a-zA-Z]+$/; // Regex to match only letters
        if (name === 'first_name' || name === 'last_name') {
            if (!value) {
                setError((prev) => ({ ...prev, [name]: `${name.replace('_', ' ')} is required.` }));
            } else if (!regex.test(value)) {
                setError((prev) => ({ ...prev, [name]: `${name.replace('_', ' ')} must only contain letters.` }));
            } else {
                setError((prev) => ({ ...prev, [name]: '' })); // Clear error if valid
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({}); // Clear previous errors

        // Validate inputs before submission
        validateInput('first_name', fanData.first_name);
        validateInput('last_name', fanData.last_name);

        // Check if there are any errors
        if (error.first_name || error.last_name) {
            return; // Stop submission if validation fails
        }

        console.log(`${isEditMode ? 'Updating' : 'Adding'} fan data:`, fanData);

        try {
            const response = await fetch(
                `http://localhost:5000/Fans${isEditMode ? `/${fan.fan_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
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
            console.error('Error:', err);
            setError({ general: err.message || 'An unexpected error occurred' });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Fan' : 'Add New Fan'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={fanData.first_name}
                        onChange={handleChange}
                        required
                    />
                    {error.first_name && <div className="text-red-500">{error.first_name}</div>} {/* Display error message */}

                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={fanData.last_name}
                        onChange={handleChange}
                        required
                    />
                    {error.last_name && <div className="text-red-500">{error.last_name}</div>} {/* Display error message */}

                    {error.general && <div className="text-red-500">{error.general}</div>} {/* General error message */}

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

export default FanForm;
