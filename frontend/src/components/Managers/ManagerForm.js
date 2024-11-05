import React, { useState, useEffect } from 'react';

const ManagerForm = ({ onClose, onSubmit, manager = {} }) => {
    const [formData, setFormData] = useState({
        first_name: manager?.first_name || '',
        last_name: manager?.last_name || '',
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(manager?.manager_id);

    useEffect(() => {
        if (manager) {
            setFormData({
                first_name: manager.first_name || '',
                last_name: manager.last_name || '',
            });
        }
    }, [manager]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateInput(name, value); // Validate input on change
    };

    const validateInput = (name, value) => {
        const regex = /^[A-Za-z\s]+$/; // Regex to match only alphabetic characters and spaces
        if (!regex.test(value) && value.trim() !== '') {
            setError(`${name} can only contain letters and spaces.`);
            return false;
        }
        setError(''); // Clear the error if valid
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} manager data:`, formData);

        // Validate input
        const isFirstNameValid = validateInput('First Name', formData.first_name);
        const isLastNameValid = validateInput('Last Name', formData.last_name);
        
        if (!isFirstNameValid || !isLastNameValid) {
            return; // Stop submission if validation fails
        }

        try {
            const response = await fetch(
                `http://localhost:5000/Managers${isEditMode ? `/${manager.manager_id}` : ''}`,
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
                const errorMsg = result.error || 'Failed to save manager data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Manager updated' : 'Manager added'} successfully:`, result);
            setFormData({ first_name: '', last_name: '' }); // Reset form on success
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
                    {isEditMode ? 'Edit Manager' : 'Add New Manager'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={formData.last_name}
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
};

export default ManagerForm;
