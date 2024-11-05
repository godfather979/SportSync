import React, { useState } from 'react';
import moment from 'moment';

export function PlayerForm({ onClose, onSubmit, player = {} }) {
    const [playerData, setPlayerData] = useState({
        player_id: player?.player_id || '',
        first_name: player?.first_name || '',
        last_name: player?.last_name || '',
        sport: player?.sport || '',
        date_of_birth: player?.date_of_birth ? moment(player.date_of_birth).format('YYYY-MM-DD') : ''
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(player?.player_id);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const alphabetRegex = /^[A-Za-z\s]*$/; // Regex to allow only alphabets and spaces

        if ((name === "first_name" || name === "last_name" || name === "sport") && !alphabetRegex.test(value)) {
            setError("Please enter only alphabets for names and sport fields.");
        } else {
            setError(''); // Clear error if input is valid
            setPlayerData({ ...playerData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} player data:`, playerData);

        try {
            const response = await fetch(
                `http://localhost:5000/Players${isEditMode ? `/${player.player_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(playerData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.error || 'Failed to save player data';
                throw new Error(errorMsg);
            }

            console.log(`${isEditMode ? 'Player updated' : 'Player added'} successfully:`, result);
            setPlayerData({ player_id: '', first_name: '', last_name: '', sport: '', date_of_birth: '' });
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
                    {isEditMode ? 'Edit Player' : 'Add New Player'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="sport"
                        placeholder="Sport Played"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.sport}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="date_of_birth"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.date_of_birth}
                        onChange={handleChange}
                        required
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
