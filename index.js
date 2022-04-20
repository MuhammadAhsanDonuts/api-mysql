const express = require('express'); 
const env = require('dotenv'); 
const bodyParser = require('body-parser'); 
const mysql = require('mysql'); 
const cors = require('cors'); 


const app = express(); 
//environment variable
env.config(); 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 


const PORT = process.env.PORT

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`); 
    
}  )

//Created connection pool to enlist required details for the connectivity. 
const db = mysql.createPool({
    connectionList:    10,
    host:              'localhost',
    user:              'root',
    password:          '',
    database:          'software_students' 
})

app.get('/get', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query(`SELECT * from batch_2k19`, (err, rows) => {
            connection.release(); //returns the connection back to pool. 

            if (!err) {
                console.log(rows)
                res.send(rows) 
            }else {
                console.log(err)
            }
        })
    })
    }); 

 app.get('/:rn', (req, res, next) => {
     db.getConnection((err, connection) => {
        if (err) throw err
            connection.query(`SELECT * from batch_2k19 WHERE Roll_No = ?`, [req.params.rn], (err, rows) => {
            connection.release(); //returns the connection back to pool. 
                if (!err) {
                    res.send(rows) 
                }else {
                    console.log(err)
                }
            })
        })
        }); 
       
app.post('/api/insert', (req, res, next) => {
        //variable getting data from front-end --
        const name = req.body.name;
        const rollno = req.body.rollno
        const skill = req.body.skills 
        //----------------------------------------
        const sqlInsert = ("INSERT INTO batch_2k19 (Name, Roll_No, Skill) VALUE (?,?,?)")
        db.query(sqlInsert, [name, rollno, skill], (err, rows) => {
            if (err) return console.log(err.message)
            else {
                res.send().json(rows)
                console.log("Record Inserted")
        }
    })

    }); 

// app.put('/update/:no', (req, res) => {
//     const rollno = req.params.no
//     const sqlInsert = ("UPDATE ")

// })
    




