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

app.get('/Players', (req,res) =>{
    const sql = "select* from Players";
    db.query(sql, (err,data) =>{
        if(err)
            return res.json(err);
        else
            return res.json(data);
    })
})

app.post('/Players', (req, res) => {
    console.log("Received body:", req.body); // Check incoming data
    const { player_id, name, sport, dob } = req.body;

    // const player_id_int = parseInt(player_id, 10);

    const sql = "INSERT INTO Players (player_id, name, sport, dob) VALUES (?, ?, ?, ?)";
    db.query(sql, [player_id, name, sport, dob], (err, data) => {
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


app.listen(5000, () => {
    console.log("Listening on port 5000");
})