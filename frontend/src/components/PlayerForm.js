import React, { useState } from 'react';
import moment from 'moment';

export function PlayerForm({ onClose, onSubmit, player = {} }) {
    const [playerData, setPlayerData] = useState({
        player_id: player?.player_id || '', // Use optional chaining
        name: player?.name || '',
        sport: player?.sport || '',
        dob: player?.dob ? moment(player.dob).format('YYYY-MM-DD') : ''
    });

    const [error, setError] = useState('');
    const isEditMode = Boolean(player?.player_id); // Use optional chaining

    const handleChange = (e) => {
        setPlayerData({ ...playerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log(`${isEditMode ? 'Updating' : 'Adding'} player data:`, playerData);

        try {
            const response = await fetch(
                `http://localhost:5000/Players${isEditMode ? `/${player.player_id}` : ''}`,
                {
                    method: isEditMode ? 'PUT' : 'POST', // Use PUT for edit, POST for new player
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
            setPlayerData({ player_id: '', name: '', sport: '', dob: '' }); // Reset form on success
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
                    {isEditMode ? 'Edit Player' : 'Add New Player'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="player_id"
                        placeholder="Player ID"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.player_id}
                        onChange={handleChange}
                        required
                        disabled={isEditMode} // Disable ID input for edit mode
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Player Name"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.name}
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
                        name="dob"
                        className="w-full p-2 rounded-md border border-gray-300 bg-gray-200 text-black"
                        value={playerData.dob}
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
