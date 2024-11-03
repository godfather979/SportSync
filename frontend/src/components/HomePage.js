"use client";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { motion } from 'framer-motion';
import { PlayerForm } from './Player/PlayerForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export function HomePage() {
  const [totalAthletes, setTotalAthletes] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const athletesResponse = await fetch('/api/players/count');
        const athletesData = await athletesResponse.json();
        setTotalAthletes(athletesData.count); // Adjust based on your API response structure

        const eventsResponse = await fetch('/api/events/upcoming');
        const eventsData = await eventsResponse.json();
        setUpcomingEvents(eventsData); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  const navigate = useNavigate();
  const words = [
    { text: "Welcome", className: "text-black dark:text-black font-prociono-regular" },
    { text: "To" , className: "text-black dark:text-black font-prociono-regular"},
    { text: "SportSync", className: "text-blue-500 dark:text-blue-500 font-prociono-regular" },
  ];

  const stats = [
    { title: 'Total Players', value: '150+', icon: '👥' },
    { title: 'Matches', value: '12', icon: '🏆' },
    { title: 'Upcoming Events', value: '8', icon: '📅' },
    { title: 'Media Broadcasters', value: '45', icon: '📊' }
  ];

  const recentActivities = [
    'Team Alpha completed training session',
    'New athlete profile added',
    'Performance report generated',
    'Updated team roster'
  ];

  const [showForm, setShowForm] = useState(false);

  const handleAddPlayer = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch('/api/addPlayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle success (refresh player data, etc.)
        setShowForm(false);
      } else {
        console.error('Error saving player data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewTables = () => {
    navigate('/table/players');
  };

  const handleViewRelations = () => {
    navigate('/relation/playerdoctor');
  };

  const handleClick = (index) => {
    console.log(`Button clicked at index: ${index}`);
    // Handle click based on index here

    if (index === 0) {
      navigateTo('/table/players');
    } else if (index === 1) {
      navigateTo('/relation/matches');
    } else if (index === 2) {
      navigateTo('/table/events');
    } else if (index === 3) {
      navigateTo('/table/media_broadcasters'); // Example for index 3
    }
  };

  const navigateTo = (path) => {
    navigate(path); // `path` is a string parameter, e.g., "/home" or "/profile"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center mt-10 mb-15">
        <TypewriterEffect words={words} />
        <div className="flex items-center justify-center space-x-4 mt-6">
          {['🏏', '🏸', '🏓', '🎾', '🏊‍♂️', '⚽'].map((emoji, index) => (
            <motion.span
              key={index}
              className="text-4xl"
              role="img"
              aria-label="emoji"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8 mb-7 ">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="card bg-gradient-to-br border-2 border-white from-blue-100 to-blue-400 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center flex-col hover:border-blue-900 hover:border-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button key={index} className="card-body " onClick={() => handleClick(index)}>
              <div className="flex items-center space-x-3">
                <span className="text-3xl flex justify-center mb-2">{stat.icon}</span>
                <div>
                  <h3 className="text-xl font-bold flex justify-self-center text-gray-800">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Activities and Quick Actions */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <motion.div
          className="card bg-gradient-to-br from-purple-200 to-blue-200 shadow-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: stats.length * 0.1 }}
        >
          <div className="card-body">
            <h2 className="card-title text-primary flex justify-center mb-4 text-3x font-prociono">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 text-md poppins-regular">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-purple-200 to-blue-200 shadow-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: stats.length * 0.1 + 0.1 }}
        >
          <div className="card-body">
            <h2 className="card-title text-primary flex justify-center mb-6 text-3xl">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-10">
              <button onClick={handleAddPlayer} className="btn btn-primary btn-outline text-2xl">Add Athlete</button>
              <button className="btn btn-primary btn-outline text-2xl">Create Team</button>
              <button className="btn btn-primary btn-outline text-2xl" onClick={handleViewRelations}>View Relation</button>
              <button className="btn btn-primary btn-outline text-2xl" onClick={handleViewTables}>View Tables</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conditional Rendering of Player Form */}
      {showForm && (
        <PlayerForm onClose={handleCloseForm} onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}

export default HomePage;
