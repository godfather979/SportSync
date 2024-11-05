import React, { useState, useEffect } from 'react';

export function Media_BroadcastersForm({ onClose, onSubmit, broadcaster = {} }) {
    const [formData, setFormData] = useState({
        broadcaster_name: broadcaster?.broadcaster_name || '',
        city: broadcaster?.city || '',
        monthly_viewers: broadcaster?.monthly_viewers || '',
    });

    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(broadcaster?.broadcaster_id);

    useEffect(() => {
        if (broadcaster) {
            setFormData({
                broadcaster_name: broadcaster.broadcaster_name || '',
                city: broadcaster.city || '',
                monthly_viewers: broadcaster.monthly_viewers || '',
            });
        }
    }, [broadcaster]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate alphabet-only input for 'broadcaster_name' and 'city'
        if (name === 'broadcaster_name' || name === 'city') {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
                setErrors({ ...errors, [name]: '' }); // Clear error if input is valid
            } else {
                setErrors({
                    ...errors,
                    [name]: 'Only alphabets and spaces are allowed',
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' }); // Clear error for other fields
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error)) {
            setErrors({ ...errors, form: 'Please fix the errors above' });
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/media_broadcasters${isEditMode ? `/${broadcaster.broadcaster_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save broadcaster data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Broadcaster updated' : 'Broadcaster added'} successfully:`, result);
            setFormData({ broadcaster_name: '', city: '', monthly_viewers: '' }); // Reset form on success
            onSubmit(); // Notify parent component of success
        } catch (err) {
            console.error('Error:', err);
            setErrors({ ...errors, form: err.message || 'An unexpected error occurred' });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Broadcaster' : 'Add New Broadcaster'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="broadcaster_name"
                            placeholder="Broadcaster Name"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={formData.broadcaster_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.broadcaster_name && (
                            <div className="text-red-500">{errors.broadcaster_name}</div>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        {errors.city && (
                            <div className="text-red-500">{errors.city}</div>
                        )}
                    </div>
                    <div>
                        <input
                            type="number"
                            name="monthly_viewers"
                            placeholder="Monthly Viewers"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={formData.monthly_viewers}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errors.form && <div className="text-red-500">{errors.form}</div>} {/* Display form-level error */}

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

export default Media_BroadcastersForm;
