const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

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

app.listen(5000, () => {
    console.log("Listening on port 5000");
})