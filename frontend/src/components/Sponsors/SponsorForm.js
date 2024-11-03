import React, { useState } from 'react';
import moment from 'moment';

export function SponsorForm({ onClose, onSubmit, sponsor = {} }) {
    const [sponsorData, setSponsorData] = useState({
        sponsor_id: sponsor?.sponsor_id || '', // Use optional chaining
        name: sponsor?.sponsor_name || '',
        
        amount: sponsor?.sponsorship_amount || '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(sponsor?.sponsor_id); // Use optional chaining

    const handleChange = (e) => {
        setSponsorData({ ...sponsorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} sponsor data:`, sponsorData);

        try {
            const response = await fetch(
                `http://localhost:5000/Sponsors${isEditMode ? `/${sponsor.sponsor_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST', // Use PUT for edit, POST for new sponsor
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sponsorData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save sponsor data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Sponsor updated' : 'Sponsor added'} successfully:`, result);
            setSponsorData({ sponsor_id: '', name: '', amount: '' }); // Reset form on success
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
                    {isEditMode ? 'Edit Sponsor' : 'Add New Sponsor'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <input
                        type="text"
                        name="sponsor_id"
                        placeholder="Sponsor ID"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={sponsorData.sponsor_id}
                        onChange={handleChange}
                        required
                        disabled={isEditMode} // Disable ID input for edit mode
                    /> */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={sponsorData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="amount"
                        placeholder="Amount"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={sponsorData.amount}
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
