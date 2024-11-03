const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host : "bahe7g2wwvdsclhaydag-mysql.services.clever-cloud.com",
    user : "ud1lrtrlrruzxqlp",
    password : "xbcULXW4UrcYPJOMEDvP",
    database : "bahe7g2wwvdsclhaydag",
})

app.get('/',(req,res) => {
    return res.json("From backend")

})


//route to get tables
app.get('/Tables', (req,res) =>{
    const sql = "show tables";
    db.query(sql, (err,data) =>{
        if(err)
            return res.json(err);
        else
            return res.json(data);
    })
})

//route to get players
app.get('/Players', (req,res) =>{
    const sql = "select* from PlayerView";
    db.query(sql, (err,data) =>{
        if(err)
            return res.json(err);
        else
            return res.json(data);
    })
})

//route to add players
app.post('/Players', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const {first_name, last_name, sport, date_of_birth } = req.body;

    // const player_id_int = parseInt(player_id, 10);

    const sql = "INSERT INTO Players (first_name, last_name, sport, date_of_birth) VALUES (?, ?, ?, ?)";
    db.query(sql, [first_name,last_name, sport, date_of_birth], (err, data) => {
        if (err) {
            console.error("Error inserting player:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Duplicate entry for player_id' });
              }
              
              return res.status(500).json({ error: 'Failed to add player' });
            }
            return res.status(201).json({ message: 'Player added successfully', data });
    });
});

//route to update players
app.put('/Players/:id', (req, res) => {
    console.log("Received body for update:", req.body); // Check incoming data
    const { first_name,last_name, sport, date_of_birth } = req.body;
    const { id: player_id } = req.params; // Extract player ID from URL

    const sql = "UPDATE Players SET first_name = ?, last_name = ?, sport = ?, date_of_birth = ? WHERE player_id = ?";
    
    db.query(sql, [first_name,last_name, sport, date_of_birth, player_id], (err, data) => {
        if (err) {
            console.error("Error updating player:", err.message);
            return res.status(500).json({ error: 'Failed to update player' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        return res.status(200).json({ message: 'Player updated successfully' });
    });
});

//route to delete players
app.delete('/Players/:id', (req, res) => {
    const { id: player_id } = req.params; // Extract player ID from URL

    const sql = "DELETE FROM Players WHERE player_id = ?";

    db.query(sql, [player_id], (err, data) => {
        if (err) {
            console.error("Error deleting player:", err.message);
            return res.status(500).json({ error: 'Failed to delete player' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        return res.status(200).json({ message: 'Player deleted successfully' });
    });
});


//route to get fans
app.get('/Fans', (req,res) =>{
    const sql = "select* from Fans";
    db.query(sql, (err,data) =>{
        if(err)
            return res.json(err);
        else
            return res.json(data);
    })
})

//route to add fans
app.post('/Fans', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const {first_name, last_name } = req.body;

    // const fan_id_int = parseInt(fan_id, 10);

    const sql = "INSERT INTO Fans (first_name, last_name) VALUES (?, ?)";
    db.query(sql, [first_name,last_name], (err, data) => {
        if (err) {
            console.error("Error inserting fan:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Duplicate entry for fan_id' });
              }
              
              return res.status(500).json({ error: 'Failed to add fan' });
            }
            return res.status(201).json({ message: 'Fan added successfully', data });
    });
});

//route to update fans
app.put('/Fans/:id', (req, res) => {
    console.log("Received body for update:", req.body); // Check incoming data
    const { first_name,last_name } = req.body;
    const { id: fan_id } = req.params; // Extract fan ID from URL

    const sql = "UPDATE Fans SET first_name = ?, last_name = ? WHERE fan_id = ?";
    
    db.query(sql, [first_name,last_name,fan_id], (err, data) => {
        if (err) {
            console.error("Error updating fan:", err.message);
            return res.status(500).json({ error: 'Failed to update fan' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Fan not found' });
        }

        return res.status(200).json({ message: 'Fan updated successfully' });
    });
});

//route to delete fans
app.delete('/Fans/:id', (req, res) => {
    const { id: fan_id } = req.params; // Extract fan ID from URL

    const sql = "DELETE FROM Fans WHERE fan_id = ?";

    db.query(sql, [fan_id], (err, data) => {
        if (err) {
            console.error("Error deleting fan:", err.message);
            return res.status(500).json({ error: 'Failed to delete fan' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Fan not found' });
        }

        return res.status(200).json({ message: 'Fan deleted successfully' });
    });
});
// Route to get all coaches
app.get('/Coaches', (req, res) => {
    const sql = "SELECT * FROM Coaches";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching coaches:", err.message);
            return res.status(500).json({ error: 'Failed to fetch coaches' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new coach
app.post('/Coaches', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { first_name, last_name, experience, sport } = req.body;

    const sql = "INSERT INTO Coaches (first_name, last_name, experience, sport) VALUES (?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, experience, sport], (err, data) => {
        if (err) {
            console.error("Error inserting coach:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Duplicate entry for coach_id' });
            }
            return res.status(500).json({ error: 'Failed to add coach' });
        }
        return res.status(201).json({ message: 'Coach added successfully', data });
    });
});

// Route to update a coach
app.put('/Coaches/:id', (req, res) => {
    console.log("Received body for update:", req.body); // Check incoming data
    const { first_name, last_name, experience, sport } = req.body;
    const { id: coach_id } = req.params; // Extract coach ID from URL

    const sql = "UPDATE Coaches SET first_name = ?, last_name = ?, experience = ?, sport = ? WHERE coach_id = ?";
    
    db.query(sql, [first_name, last_name, experience, sport, coach_id], (err, data) => {
        if (err) {
            console.error("Error updating coach:", err.message);
            return res.status(500).json({ error: 'Failed to update coach' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        return res.status(200).json({ message: 'Coach updated successfully' });
    });
});

// Route to delete a coach
app.delete('/Coaches/:id', (req, res) => {
    const { id: coach_id } = req.params; // Extract coach ID from URL

    const sql = "DELETE FROM Coaches WHERE coach_id = ?";

    db.query(sql, [coach_id], (err, data) => {
        if (err) {
            console.error("Error deleting coach:", err.message);
            return res.status(500).json({ error: 'Failed to delete coach' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        return res.status(200).json({ message: 'Coach deleted successfully' });
    });
});
// Route to fetch all doctors
app.get('/Doctors', (req, res) => {
    const sql = "SELECT * FROM Doctors"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching doctors:", err.message);
            return res.status(500).json({ error: 'Failed to fetch doctors' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new doctor
app.post('/Doctors', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { first_name, last_name, specialization, institute_id } = req.body; // Removed player_id

    const sql = "INSERT INTO Doctors (first_name, last_name, specialization, institute_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, specialization, institute_id], (err, data) => {
        if (err) {
            console.error("Error inserting doctor:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Duplicate entry for doctor_id' });
            }
            return res.status(500).json({ error: 'Failed to add doctor' });
        }
        return res.status(201).json({ message: 'Doctor added successfully', data });
    });
});

// Route to update a doctor
app.put('/Doctors/:id', (req, res) => {
    console.log("Received body for update:", req.body); // Check incoming data
    const { first_name, last_name, specialization, institute_id } = req.body; // Removed player_id
    const { id: doctor_id } = req.params; // Extract doctor ID from URL

    // Corrected SQL query without a trailing comma
    const sql = "UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, institute_id = ? WHERE doctor_id = ?";
    
    db.query(sql, [first_name, last_name, specialization, institute_id, doctor_id], (err, data) => {
        if (err) {
            console.error("Error updating doctor:", err.message);
            return res.status(500).json({ error: 'Failed to update doctor' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({ message: 'Doctor updated successfully' });
    });
});

// Route to delete a doctor
app.delete('/Doctors/:id', (req, res) => {
    const { id: doctor_id } = req.params; // Extract doctor ID from URL

    const sql = "DELETE FROM Doctors WHERE doctor_id = ?";

    db.query(sql, [doctor_id], (err, data) => {
        if (err) {
            console.error("Error deleting doctor:", err.message);
            return res.status(500).json({ error: 'Failed to delete doctor' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({ message: 'Doctor deleted successfully' });
    });
});

// Route to fetch all sponsors
app.get('/Sponsors', (req, res) => {
    const sql = "SELECT * FROM Sponsors"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching sponsors:", err.message);
            return res.status(500).json({ error: 'Failed to fetch sponsors' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new sponsor
app.post('/Sponsors', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { name, amount } = req.body; // Removed player_id

    const sql = "INSERT INTO Sponsors (sponsor_name, sponsorship_amount) VALUES (?, ?)";
    db.query(sql, [name, amount], (err, data) => {
        if (err) {
            console.error("Error inserting sponsor:", err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Duplicate entry for sponsor_id' });
            }
            return res.status(500).json({ error: 'Failed to add sponsor' });
        }
        return res.status(201).json({ message: 'Sponsor added successfully', data });
    });
});

// Route to update a sponsor
app.put('/Sponsors/:id', (req, res) => {
    console.log("Received body for update:", req.body); // Check incoming data
    const { name, amount } = req.body; // Removed player_id
    const { id: sponsor_id } = req.params; // Extract sponsor ID from URL

    // Corrected SQL query without a trailing comma
    const sql = "UPDATE Sponsors SET sponsor_name = ?, sponsorship_amount = ? WHERE sponsor_id = ?";
    
    db.query(sql, [name, amount,sponsor_id], (err, data) => {
        if (err) {
            console.error("Error updating sponsor:", err.message);
            return res.status(500).json({ error: 'Failed to update sponsor' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        return res.status(200).json({ message: 'Sponsor updated successfully' });
    });
});

// Route to delete a sponsor
app.delete('/Sponsors/:id', (req, res) => {
    const { id: sponsor_id } = req.params; // Extract sponsor ID from URL

    const sql = "DELETE FROM Sponsors WHERE sponsor_id = ?";

    db.query(sql, [sponsor_id], (err, data) => {
        if (err) {
            console.error("Error deleting sponsor:", err.message);
            return res.status(500).json({ error: 'Failed to delete sponsor' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        return res.status(200).json({ message: 'Sponsor deleted successfully' });
    });
});

// Route to fetch all events
app.get('/events', (req, res) => {
    const sql = "SELECT * FROM Events"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching events:", err.message);
            return res.status(500).json({ error: 'Failed to fetch events' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new event
app.post('/events', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { event_name, event_date, location, description } = req.body; // Extract fields including description

    const sql = "INSERT INTO Events (event_name, event_date, location, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [event_name, event_date, location, description], (err, data) => {
        if (err) {
            console.error("Error inserting event:", err.message);
            return res.status(500).json({ error: 'Failed to add event' });
        }
        return res.status(201).json({ message: 'Event added successfully', data });
    });
});

// Route to update an event
app.put('/events/:id', (req, res) => {
    const { id: event_id } = req.params; // Extract event ID from URL
    const { event_name, event_date, location, description } = req.body; // Extract fields including description

    const sql = "UPDATE Events SET event_name = ?, event_date = ?, location = ?, description = ? WHERE event_id = ?";
    db.query(sql, [event_name, event_date, location, description, event_id], (err, data) => {
        if (err) {
            console.error("Error updating event:", err.message);
            return res.status(500).json({ error: 'Failed to update event' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json({ message: 'Event updated successfully' });
    });
});

// Route to delete an event
app.delete('/events/:id', (req, res) => {
    const { id: event_id } = req.params; // Extract event ID from URL

    const sql = "DELETE FROM Events WHERE event_id = ?";
    db.query(sql, [event_id], (err, data) => {
        if (err) {
            console.error("Error deleting event:", err.message);
            return res.status(500).json({ error: 'Failed to delete event' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json({ message: 'Event deleted successfully' });
    });
});

// Route to fetch all institutes
app.get('/institutes', (req, res) => {
    const sql = "SELECT * FROM Institutes"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching institutes:", err.message);
            return res.status(500).json({ error: 'Failed to fetch institutes' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new institute
app.post('/institutes', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { institute_name, city, ranking, sports_type, established_year } = req.body; // Extract fields

    const sql = "INSERT INTO Institutes (institute_name, city, ranking, sports_type, established_year) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [institute_name, city, ranking, sports_type, established_year], (err, data) => {
        if (err) {
            console.error("Error inserting institute:", err.message);
            return res.status(500).json({ error: 'Failed to add institute' });
        }
        return res.status(201).json({ message: 'Institute added successfully', data });
    });
});

// Route to update an institute
app.put('/institutes/:id', (req, res) => {
    const { id: institute_id } = req.params; // Extract institute ID from URL
    const { institute_name, city, ranking, sports_type, established_year } = req.body; // Extract fields

    const sql = "UPDATE Institutes SET institute_name = ?, city = ?, ranking = ?, sports_type = ?, established_year = ? WHERE institute_id = ?";
    db.query(sql, [institute_name, city, ranking, sports_type, established_year, institute_id], (err, data) => {
        if (err) {
            console.error("Error updating institute:", err.message);
            return res.status(500).json({ error: 'Failed to update institute' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Institute not found' });
        }

        return res.status(200).json({ message: 'Institute updated successfully' });
    });
});

// Route to delete an institute
app.delete('/institutes/:id', (req, res) => {
    const { id: institute_id } = req.params; // Extract institute ID from URL

    const sql = "DELETE FROM Institutes WHERE institute_id = ?";
    db.query(sql, [institute_id], (err, data) => {
        if (err) {
            console.error("Error deleting institute:", err.message);
            return res.status(500).json({ error: 'Failed to delete institute' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Institute not found' });
        }

        return res.status(200).json({ message: 'Institute deleted successfully' });
    });
});
// Route to fetch all managers
app.get('/managers', (req, res) => {
    const sql = "SELECT * FROM Managers"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching managers:", err.message);
            return res.status(500).json({ error: 'Failed to fetch managers' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new manager
app.post('/managers', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const {  first_name, last_name } = req.body; // Extract fields

    const sql = "INSERT INTO Managers ( first_name, last_name) VALUES (?, ?)";
    db.query(sql, [ first_name, last_name], (err, data) => {
        if (err) {
            console.error("Error inserting manager:", err.message);
            return res.status(500).json({ error: 'Failed to add manager' });
        }
        return res.status(201).json({ message: 'Manager added successfully', data });
    });
});

// Route to update a manager
app.put('/managers/:id', (req, res) => {
    const { id: manager_id } = req.params; // Extract manager ID from URL
    const { first_name, last_name } = req.body; // Extract fields

    const sql = "UPDATE Managers SET first_name = ?, last_name = ? WHERE manager_id = ?";
    db.query(sql, [first_name, last_name, manager_id], (err, data) => {
        if (err) {
            console.error("Error updating manager:", err.message);
            return res.status(500).json({ error: 'Failed to update manager' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Manager not found' });
        }

        return res.status(200).json({ message: 'Manager updated successfully' });
    });
});

// Route to delete a manager
app.delete('/managers/:id', (req, res) => {
    const { id: manager_id } = req.params; // Extract manager ID from URL

    const sql = "DELETE FROM Managers WHERE manager_id = ?";
    db.query(sql, [manager_id], (err, data) => {
        if (err) {
            console.error("Error deleting manager:", err.message);
            return res.status(500).json({ error: 'Failed to delete manager' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Manager not found' });
        }

        return res.status(200).json({ message: 'Manager deleted successfully' });
    });
});

// Route to fetch all media broadcasters
app.get('/media_broadcasters', (req, res) => {
    const sql = "SELECT * FROM Media_Broadcasters"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching media broadcasters:", err.message);
            return res.status(500).json({ error: 'Failed to fetch media broadcasters' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new media broadcaster
app.post('/media_broadcasters', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { broadcaster_name, city, monthly_viewers } = req.body; // Extract fields

    const sql = "INSERT INTO Media_Broadcasters (broadcaster_name, city, monthly_viewers) VALUES (?, ?, ?)";
    db.query(sql, [broadcaster_name, city, monthly_viewers], (err, data) => {
        if (err) {
            console.error("Error inserting media broadcaster:", err.message);
            return res.status(500).json({ error: 'Failed to add media broadcaster' });
        }
        return res.status(201).json({ message: 'Media broadcaster added successfully', data });
    });
});

// Route to update a media broadcaster
app.put('/media_broadcasters/:id', (req, res) => {
    const { id: broadcaster_id } = req.params; // Extract broadcaster ID from URL
    const { broadcaster_name, city, monthly_viewers } = req.body; // Extract fields

    const sql = "UPDATE Media_Broadcasters SET broadcaster_name = ?, city = ?, monthly_viewers = ? WHERE broadcaster_id = ?";
    db.query(sql, [broadcaster_name, city, monthly_viewers, broadcaster_id], (err, data) => {
        if (err) {
            console.error("Error updating media broadcaster:", err.message);
            return res.status(500).json({ error: 'Failed to update media broadcaster' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Media broadcaster not found' });
        }

        return res.status(200).json({ message: 'Media broadcaster updated successfully' });
    });
});

// Route to delete a media broadcaster
app.delete('/media_broadcasters/:id', (req, res) => {
    const { id: broadcaster_id } = req.params; // Extract broadcaster ID from URL

    const sql = "DELETE FROM Media_Broadcasters WHERE broadcaster_id = ?";
    db.query(sql, [broadcaster_id], (err, data) => {
        if (err) {
            console.error("Error deleting media broadcaster:", err.message);
            return res.status(500).json({ error: 'Failed to delete media broadcaster' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Media broadcaster not found' });
        }

        return res.status(200).json({ message: 'Media broadcaster deleted successfully' });
    });
});
// Route to fetch all sports facilities
app.get('/sports_facilities', (req, res) => {
    const sql = "SELECT * FROM Sports_Facilities"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching sports facilities:", err.message);
            return res.status(500).json({ error: 'Failed to fetch sports facilities' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new sports facility
app.post('/sports_facilities', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { facility_name, location, capacity, facility_type } = req.body; // Extract fields

    const sql = "INSERT INTO Sports_Facilities (facility_name, location, capacity, facility_type) VALUES (?, ?, ?, ?)";
    db.query(sql, [facility_name, location, capacity, facility_type], (err, data) => {
        if (err) {
            console.error("Error inserting sports facility:", err.message);
            return res.status(500).json({ error: 'Failed to add sports facility' });
        }
        return res.status(201).json({ message: 'Sports facility added successfully', data });
    });
});

// Route to update a sports facility
app.put('/sports_facilities/:id', (req, res) => {
    const { id: facility_id } = req.params; // Extract facility ID from URL
    const { facility_name, location, capacity, facility_type } = req.body; // Extract fields

    const sql = "UPDATE Sports_Facilities SET facility_name = ?, location = ?, capacity = ?, facility_type  = ? WHERE facility_id = ?";
    db.query(sql, [facility_name, location, capacity, facility_type , facility_id], (err, data) => {
        if (err) {
            console.error("Error updating sports facility:", err.message);
            return res.status(500).json({ error: 'Failed to update sports facility' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sports facility not found' });
        }

        return res.status(200).json({ message: 'Sports facility updated successfully' });
    });
});

// Route to delete a sports facility
app.delete('/sports_facilities/:id', (req, res) => {
    const { id: facility_id } = req.params; // Extract facility ID from URL

    const sql = "DELETE FROM Sports_Facilities WHERE facility_id = ?";
    db.query(sql, [facility_id], (err, data) => {
        if (err) {
            console.error("Error deleting sports facility:", err.message);
            return res.status(500).json({ error: 'Failed to delete sports facility' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sports facility not found' });
        }

        return res.status(200).json({ message: 'Sports facility deleted successfully' });
    });
});
// Route to fetch all sports federations
app.get('/sports_federations', (req, res) => {
    const sql = "SELECT * FROM Sports_Federations"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching sports federations:", err.message);
            return res.status(500).json({ error: 'Failed to fetch sports federations' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new sports federation
app.post('/sports_federations', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { federation_name, country, contact_number, email, established_year } = req.body; // Extract fields

    const sql = "INSERT INTO Sports_Federations (federation_name, country, contact_number, email, established_year) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [federation_name, country, contact_number, email, established_year], (err, data) => {
        if (err) {
            console.error("Error inserting sports federation:", err.message);
            return res.status(500).json({ error: 'Failed to add sports federation' });
        }
        return res.status(201).json({ message: 'Sports federation added successfully', data });
    });
});

// Route to update a sports federation
app.put('/sports_federations/:id', (req, res) => {
    const { id: federation_id } = req.params; // Extract federation ID from URL
    const { federation_name, country, contact_number, email, established_year } = req.body; // Extract fields

    const sql = "UPDATE Sports_Federations SET federation_name = ?, country = ?, contact_number = ?, email = ?, established_year = ? WHERE federation_id = ?";
    db.query(sql, [federation_name, country, contact_number, email, established_year, federation_id], (err, data) => {
        if (err) {
            console.error("Error updating sports federation:", err.message);
            return res.status(500).json({ error: 'Failed to update sports federation' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sports federation not found' });
        }

        return res.status(200).json({ message: 'Sports federation updated successfully' });
    });
});

// Route to delete a sports federation
app.delete('/sports_federations/:id', (req, res) => {
    const { id: federation_id } = req.params; // Extract federation ID from URL

    const sql = "DELETE FROM Sports_Federations WHERE federation_id = ?";
    db.query(sql, [federation_id], (err, data) => {
        if (err) {
            console.error("Error deleting sports federation:", err.message);
            return res.status(500).json({ error: 'Failed to delete sports federation' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Sports federation not found' });
        }

        return res.status(200).json({ message: 'Sports federation deleted successfully' });
    });
});


// Route to fetch all referees
app.get('/Referees', (req, res) => {
    const sql = "SELECT * FROM Referees"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching media broadcasters:", err.message);
            return res.status(500).json({ error: 'Failed to fetch media broadcasters' });
        }
        return res.status(200).json(data);
    });
});

// Route to add a new referee
app.post('/Referees', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { first_name, last_name, experience } = req.body; // Extract fields

    const sql = "INSERT INTO Referees (first_name, last_name, experience) VALUES (?, ?, ?)";
    db.query(sql, [first_name, last_name, experience], (err, data) => {
        if (err) {
            console.error("Error inserting referee:", err.message);
            return res.status(500).json({ error: 'Failed to add referee' });
        }
        return res.status(201).json({ message: 'Referee added successfully', data });
    });
});

// Route to update a referee
app.put('/Referees/:id', (req, res) => {
    const { id: referee_id } = req.params; // Extract broadcaster ID from URL
    const { first_name, last_name, experience } = req.body; // Extract fields

    const sql = "UPDATE Referees SET first_name = ?, last_name = ?, experience = ? WHERE referee_id = ?";
    db.query(sql, [first_name, last_name, experience,referee_id], (err, data) => {
        if (err) {
            console.error("Error updating referee:", err.message);
            return res.status(500).json({ error: 'Failed to update referee' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Referee not found' });
        }

        return res.status(200).json({ message: 'Referee updated successfully' });
    });
});

// Route to delete a referee
app.delete('/Referees/:id', (req, res) => {
    const { id: referee_id } = req.params; // Extract referee ID from URL

    const sql = "DELETE FROM Referees WHERE referee_id = ?";
    db.query(sql, [referee_id], (err, data) => {
        if (err) {
            console.error("Error deleting media referee:", err.message);
            return res.status(500).json({ error: 'Failed to delete media referee' });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'Media referee not found' });
        }

        return res.status(200).json({ message: 'Media referee deleted successfully' });
    });
});

// Route to fetch all player_id
app.get('/player_id', (req, res) => {
    const sql = "SELECT player_id FROM Players"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching player_ids:", err.message);
            return res.status(500).json({ error: 'Failed to fetch player_ids' });
        }
        return res.status(200).json(data);
    });
});

// Route to fetch all doctor_id
app.get('/doctor_id', (req, res) => {
    const sql = "SELECT doctor_id FROM Doctors"; // Ensure your table name is correct
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching doctor_ids:", err.message);
            return res.status(500).json({ error: 'Failed to fetch doctor_ids' });
        }
        return res.status(200).json(data);
    });
});

// Route to fetch all matches
app.get('/Matches', (req, res) => {
    const sql = `SELECT 
                    m.match_id,
                    p1.first_name AS player1_f_name, 
                    p1.last_name AS player1_l_name, 
                    p1.age AS player1age, 
                    p2.first_name AS player2_f_name, 
                    p2.last_name AS player2_l_name, 
                    p1.age AS player2_age, 
                    r.first_name AS referee_f_name, 
                    r.last_name AS referee_l_name, 

                    sf.facility_name AS facility_name, 
                    sf.location AS facility_location,
                    m.date

                    FROM 
                    Matches m 
                    JOIN 
                    PlayerView p1 ON m.player1_id = p1.player_id 
                    JOIN 
                    PlayerView p2 ON m.player2_id = p2.player_id 
                    JOIN 
                    Referees r ON m.referee_id = r.referee_id
                    JOIN 
                    Sports_Facilities sf ON m.facility_id = sf.facility_id;`


    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching doctor_ids:", err.message);
            return res.status(500).json({ error: 'Failed to fetch doctor_ids' });
        }
        return res.status(200).json(data);
    });
});

//player-doctor query
app.get('/players/:playerId/doctors/:doctorId', (req, res) => {
    const player_id = parseInt(req.params.playerId, 10); // Ensure ID is a number
    const doctor_id = parseInt(req.params.doctorId, 10); // Ensure ID is a number

    let sql;
    let queryParams = [];

    if(doctor_id!==0 && player_id===0){

        sql = 
        `SELECT p.player_id, p.first_name AS p_f_name ,p.last_name as p_l_name, p.sport, p.age, d.doctor_id, d.first_name, d.last_name, d.specialization
        FROM PlayerView p
        JOIN PlayerDoctor pd ON p.player_id = pd.player_id
        JOIN Doctors d ON pd.doctor_id = d.doctor_id
        WHERE d.doctor_id=?;`
        queryParams = [doctor_id];
    }

    else if(player_id!==0&&doctor_id===0){

        sql = 
        `SELECT p.player_id, p.first_name AS p_f_name ,p.last_name as p_l_name, p.sport, p.age, d.doctor_id, d.first_name, d.last_name, d.specialization
        FROM PlayerView p
        JOIN PlayerDoctor pd ON p.player_id = pd.player_id
        JOIN Doctors d ON pd.doctor_id = d.doctor_id
        WHERE p.player_id=?;`
        queryParams = [player_id];
    }

    else{
        sql = 
        `SELECT p.player_id, p.first_name AS p_f_name ,p.last_name as p_l_name, p.sport, p.age, d.doctor_id, d.first_name, d.last_name, d.specialization
        FROM PlayerView p
        JOIN PlayerDoctor pd ON p.player_id = pd.player_id
        JOIN Doctors d ON pd.doctor_id = d.doctor_id;`
        
    }
    

    db.query(sql, queryParams, (err, data) => {
        if (err) {
            console.error("Error fetching player data:", err.message);
            return res.status(500).json({ error: 'Failed to fetch player data' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'No matching records found' });
        }

        return res.status(200).json(data);
    });
});


// Route to add a new referee
app.post('/PlayerDoctor', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { player_id, doctor_id } = req.body; // Extract fields

    const sql = "INSERT INTO PlayerDoctor (player_id, doctor_id) VALUES (?, ?)";
    db.query(sql, [player_id, doctor_id], (err, data) => {
        if (err) {
            console.error("Error inserting referee:", err.message);
            return res.status(500).json({ error: 'Failed to add relation' });
        }
        return res.status(201).json({ message: 'Referee added successfully', data });
    });
});




app.listen(5000, () => {
    console.log("Listening on port 5000");
})