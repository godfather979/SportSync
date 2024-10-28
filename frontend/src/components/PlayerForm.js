import React, { useState } from 'react';

export function PlayerForm({ onClose, onSubmit }) {
    const [playerData, setPlayerData] = useState({
        player_id: '',
        name: '',
        sport: '',
        dob: '',
    });

    const [error, setError] = useState('');

    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleChange = (e) => {
        setPlayerData({ ...playerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log("Submitting player data:", playerData); // Log player data
        try {
            const response = await fetch('http://localhost:5000/Players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            });

            const result = await response.json();
    
            if (!response.ok) {
                // Handle error and set meaningful error message
                const errorMsg = result.error || 'Failed to add player';
                throw new Error(errorMsg);
              }
          
              console.log('Player added successfully:', result);
              // Reset form or take further action on success
              setPlayerData({ player_id: '', name: '', sport: '', dob: '' });
            } catch (err) {
              console.error('Error:', err); // Log the full error object
              setError(err.message || 'An unexpected error occurred'); // Set error message for display
            }
          };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[375px] h-[400px] bg-gray-50 rounded-tl-[35px] rounded-tr-[35px] p-6 relative">
                <h2 className="text-xl font-bold mb-4">Add New Player</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="player_id"
                        placeholder="Player ID"
                        className="w-full p-2 rounded-md border border-gray-300"
                        value={playerData.player_id}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Player Name"
                        className="w-full p-2 rounded-md border border-gray-300"
                        value={playerData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="sport"
                        placeholder="Sport Played"
                        className="w-full p-2 rounded-md border border-gray-300"
                        value={playerData.sport}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        className="w-full p-2 rounded-md border border-gray-300"
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
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
