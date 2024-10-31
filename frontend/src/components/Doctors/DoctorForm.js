// DoctorForm.js
import React, { useState } from 'react';

export function DoctorForm({ onClose, onSubmit, doctor = {} }) {
    const [doctorData, setDoctorData] = useState({
        doctor_id: doctor?.doctor_id || '',
        first_name: doctor?.first_name || '',
        last_name: doctor?.last_name || '',
        specialization: doctor?.specialization || '',
        institute_id: doctor?.institute_id || '',
        player_id: doctor?.player_id || '' // Assuming this is needed for your use case
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(doctor?.doctor_id);

    const handleChange = (e) => {
        setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} doctor data:`, doctorData);

        try {
            const response = await fetch(
                `http://localhost:5000/Doctors${isEditMode ? `/${doctor.doctor_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(doctorData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save doctor data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Doctor updated' : 'Doctor added'} successfully:`, result);
            setDoctorData({ doctor_id: '', first_name: '', last_name: '', specialization: '', institute_id: '', player_id: '' });
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
                    {isEditMode ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={doctorData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={doctorData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="specialization"
                        placeholder="Specialization"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={doctorData.specialization}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="institute_id"
                        placeholder="Institute ID"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={doctorData.institute_id}
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
