import React, { useState } from 'react';

export function Sports_FacilitiesForm({ onClose, onSubmit, facility = {} }) {
    const [facilityData, setFacilityData] = useState({
        facility_id: facility?.facility_id || '',
        facility_name: facility?.facility_name || '',
        location: facility?.location || '',
        capacity: facility?.capacity || '',
        facility_type: facility?.facility_type || ''
    });

    const [errors, setErrors] = useState({
        facility_name: '',
        location: '',
        capacity: ''
    });
    const isEditMode = Boolean(facility?.facility_id);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        if (name === 'facility_name' || name === 'location') {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setFacilityData({ ...facilityData, [name]: value });
            } else {
                error = `${name === 'facility_name' ? 'Facility Name' : 'Location'} should only contain letters.`;
            }
        } else if (name === 'capacity') {
            if (/^\d*$/.test(value)) {
                setFacilityData({ ...facilityData, [name]: value });
            } else {
                error = 'Capacity should only contain numbers.';
            }
        } else {
            setFacilityData({ ...facilityData, [name]: value });
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ facility_name: '', location: '', capacity: '' });

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
            setErrors((prevErrors) => ({
                ...prevErrors,
                form: err.message || 'An unexpected error occurred'
            }));
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Facility' : 'Add New Facility'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="facility_name"
                            placeholder="Facility Name"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={facilityData.facility_name}
                            onChange={handleChange}
                            required
                        />
                        {errors.facility_name && <div className="text-red-500">{errors.facility_name}</div>}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={facilityData.location}
                            onChange={handleChange}
                            required
                        />
                        {errors.location && <div className="text-red-500">{errors.location}</div>}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={facilityData.capacity}
                            onChange={handleChange}
                            required
                        />
                        {errors.capacity && <div className="text-red-500">{errors.capacity}</div>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="facility_type"
                            placeholder="Facility Type (Indoor/Outdoor)"
                            className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                            value={facilityData.facility_type}
                            onChange={handleChange}
                        />
                    </div>

                    {errors.form && <div className="text-red-500">{errors.form}</div>}

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
