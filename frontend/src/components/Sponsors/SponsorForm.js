import React, { useState } from 'react';

export function SponsorForm({ onClose, onSubmit, sponsor = {} }) {
    const [sponsorData, setSponsorData] = useState({
        sponsor_id: sponsor?.sponsor_id || '', 
        name: sponsor?.sponsor_name || '',
        amount: sponsor?.sponsorship_amount || '',
    });

    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(sponsor?.sponsor_id);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate name to contain only alphabets and spaces
        if (name === 'name') {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setSponsorData({ ...sponsorData, [name]: value });
                setErrors({ ...errors, name: '' }); // Clear error if valid
            } else {
                setErrors({ ...errors, name: 'Only alphabets and spaces are allowed' });
            }
        }

        // Validate amount to contain only numeric values
        else if (name === 'amount') {
            if (/^\d*$/.test(value)) {
                setSponsorData({ ...sponsorData, [name]: value });
                setErrors({ ...errors, amount: '' }); // Clear error if valid
            } else {
                setErrors({ ...errors, amount: 'Only numeric values are allowed' });
            }
        } else {
            setSponsorData({ ...sponsorData, [name]: value });
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error)) {
            setErrors({ ...errors, form: 'Please fix the errors above' });
            return;
        }

        console.log(`${isEditMode ? 'Updating' : 'Adding'} sponsor data:`, sponsorData);

        try {
            const response = await fetch(
                `http://localhost:5000/Sponsors${isEditMode ? `/${sponsor.sponsor_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
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
            setSponsorData({ sponsor_id: '', name: '', amount: '' });
            onSubmit();
        } catch (err) {
            console.error('Error:', err);
            setErrors({ ...errors, form: err.message || 'An unexpected error occurred' });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Sponsor' : 'Add New Sponsor'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={sponsorData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <div className="text-red-500">{errors.name}</div>} {/* Display name error */}

                    <input
                        type="text"
                        name="amount"
                        placeholder="Amount"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={sponsorData.amount}
                        onChange={handleChange}
                        required
                    />
                    {errors.amount && <div className="text-red-500">{errors.amount}</div>} {/* Display amount error */}

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

export default SponsorForm;
