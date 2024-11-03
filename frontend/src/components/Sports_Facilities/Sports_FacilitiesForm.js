import React, { useState } from 'react';

export function Sports_FacilitiesForm({ onClose, onSubmit, facility = {} }) {
    const [facilityData, setFacilityData] = useState({
        facility_id: facility?.facility_id || '',
        facility_name: facility?.facility_name || '',
        location: facility?.location || '',
        capacity: facility?.capacity || '',
        facility_type: facility?.facility_type || ''
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(facility?.facility_id);

    const handleChange = (e) => {
        setFacilityData({ ...facilityData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} facility data:`, facilityData);

        try {
            const response = await fetch(
                `http://localhost:5000/Sports_Facilities${isEditMode ? `/${facility.facility_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(facilityData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save facility data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Facility updated' : 'Facility added'} successfully:`, result);
            setFacilityData({ facility_id: '', facility_name: '', location: '', capacity: '', facility_type: '' });
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
                    {isEditMode ? 'Edit Facility' : 'Add New Facility'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="facility_name"
                        placeholder="Facility Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={facilityData.facility_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={facilityData.location}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={facilityData.capacity}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="facility_type"
                        placeholder="Facility Type (Indoor/Outdoor)"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={facilityData.facility_type}
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
