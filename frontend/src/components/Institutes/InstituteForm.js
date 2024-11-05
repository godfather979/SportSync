import React, { useState, useEffect } from 'react';
import moment from 'moment';

export function InstituteForm({ onClose, onSubmit, institute = {} }) {
    const [formData, setFormData] = useState({
        institute_name: institute?.institute_name || '',
        city: institute?.city || '',
        ranking: institute?.ranking || '',
        sports_type: institute?.sports_type || '',
        established_year: institute?.established_year ? moment(institute.established_year).format('YYYY') : '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(institute?.institute_id);

    useEffect(() => {
        if (institute) {
            setFormData({
                institute_name: institute.institute_name || '',
                city: institute.city || '',
                ranking: institute.ranking || '',
                sports_type: institute.sports_type || '',
                established_year: institute.established_year ? moment(institute.established_year).format('YYYY') : '',
            });
        }
    }, [institute]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate input on change
        if (name !== 'ranking' && name !== 'established_year') {
            validateInput(name, value);
        }
    };

    const validateInput = (name, value) => {
        const regex = /^[A-Za-z\s]+$/; // Regex to match only alphabetic characters and spaces
        if (!regex.test(value) && value.trim() !== '') {
            setError(`${name} can only contain letters and spaces.`);
            return false;
        }
        setError(''); // Clear error if valid
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        console.log(`${isEditMode ? 'Updating' : 'Adding'} institute data:`, formData);

        // Validate inputs before submission
        const isInstituteNameValid = validateInput('Institute Name', formData.institute_name);
        const isCityValid = validateInput('City', formData.city);
        const isSportsTypeValid = validateInput('Sports Type', formData.sports_type);
        
        // Stop submission if validation fails
        if (!isInstituteNameValid || !isCityValid || !isSportsTypeValid) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/Institutes${isEditMode ? `/${institute.institute_id}` : ''}`,
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
                const errorMsg = result.error || 'Failed to save institute data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Institute updated' : 'Institute added'} successfully:`, result);
            setFormData({ institute_name: '', city: '', ranking: '', sports_type: '', established_year: '' }); // Reset form on success
            onSubmit(); // Notify parent component of success
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-400 bg-opacity-50">
            <div className="w-[375px] h-[500px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">
                    {isEditMode ? 'Edit Institute' : 'Add New Institute'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="institute_name"
                        placeholder="Institute Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.institute_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="ranking"
                        placeholder="Ranking"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.ranking}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="sports_type"
                        placeholder="Sports Type Indoor/Outdoor"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.sports_type}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="established_year"
                        placeholder="Established Year (YYYY)"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.established_year}
                        onChange={handleChange}
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

export default InstituteForm;
