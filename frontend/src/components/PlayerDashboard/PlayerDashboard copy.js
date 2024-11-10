import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Cards";
import { User, Users, Building, Heart, Award } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const Dashboard1 = () => {
  const [data, setData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("http://localhost:5000/playerdata"); // Fetch all players
      const data = await res.json();
      setData(data); // Save the players' data
      console.log(data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Display a loading message if `data` is still empty or undefined
  if (!data.length) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <User className="w-8 h-8 text-blue-500" />
              <CardTitle>Player Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {data[0]?.p_f_name} {data[0]?.p_l_name}
                </p>
                <p>Sport: {data[0]?.p_sport}</p>
                <p>Date of Birth: {formatDate(data[0]?.p_dob)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Users className="w-8 h-8 text-green-500" />
              <CardTitle>Manager Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {data[0]?.m_f_name} {data[0]?.m_l_name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Award className="w-8 h-8 text-purple-500" />
              <CardTitle>Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p className="font-semibold">
                      {item.c_f_name} {item.c_l_name}
                    </p>
                    <p>Experience: {item.c_experience} years</p>
                    <p>Sport: {item.c_sport || "Not specified"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Building className="w-8 h-8 text-orange-500" />
              <CardTitle>Institute Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{data[0]?.i_name}</p>
                <p>City: {data[0]?.i_city}</p>
                <p>Rank: {data[0]?.i_rank}</p>
                <p>Sports Type: {data[0]?.i_sports_type}</p>
                <p>Established: {data[0]?.i_year}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Heart className="w-8 h-8 text-red-500" />
              <CardTitle>Fans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(new Set(data.map((item) => item.fan_id))).map(
                  (fanId) => {
                    const fan = data.find((item) => item.fan_id === fanId);
                    return (
                      <div key={fanId} className="p-2 bg-gray-50 rounded">
                        <p className="font-semibold">
                          {fan?.f_f_name} {fan?.f_l_name}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard1;
