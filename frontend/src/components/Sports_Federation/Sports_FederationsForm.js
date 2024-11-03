import React, { useState } from 'react';
import moment from 'moment';

export function Sports_FederationsForm({ onClose, onSubmit, federation = {} }) {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 100 }, (_, index) => currentYear - index); // Generates the last 100 years

    const [federationData, setFederationData] = useState({
        federation_id: federation?.federation_id || '',
        federation_name: federation?.federation_name || '',
        country: federation?.country || '',
        contact_number: federation?.contact_number || '',
        email: federation?.email || '',
        established_year: federation?.established_year ? moment(federation.established_year).format('YYYY') : ''
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(federation?.federation_id);

    const handleChange = (e) => {
        setFederationData({ ...federationData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} federation data:`, federationData);

        try {
            const response = await fetch(
                `http://localhost:5000/sports_federations${isEditMode ? `/${federation.federation_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(federationData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save federation data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Federation updated' : 'Federation added'} successfully:`, result);
            setFederationData({ federation_id: '', federation_name: '', country: '', contact_number: '', email: '', established_year: '' });
            onSubmit();
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[450px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Sports Federation' : 'Add New Sports Federation'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="federation_name"
                        placeholder="Federation Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={federationData.federation_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={federationData.country}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="contact_number"
                        placeholder="Contact Number"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={federationData.contact_number}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={federationData.email}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="established_year"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={federationData.established_year}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Established Year</option>
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

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
