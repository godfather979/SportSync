import { useEffect, useState } from "react";
import moment from "moment";


function Players() {

    const[data,setData] = useState([]);

    useEffect (()=> {
        fetch('http://localhost:5000/Players')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));

    }, [])
    
    
    return (
        <>
        <div className = "p-5">
            <div className = "text-center font-bold text-lg py-3">Players</div>
            <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>ID</th>
        <th>Name</th>
        <th>Sport</th>
        <th>Date of Birth</th>
      </tr>
    </thead>
    <tbody>
      {data.map((d,i) => (
        <tr key = {i} className = "hover">
            <td></td>
            <td>{d.player_id}</td>
            <td>{d.name}</td>
            <td>{d.sport}</td>
            <td>{moment(d.dob).format("DD/MM/YYYY")}</td>
            
        </tr>

      ))}
      
    </tbody>
  </table>
</div>
</div>
        </>
        
    );
}

export default Players;
