// Entry Point of the API Server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
 
// const Pool = require('pg').Pool;
 
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'version_manager',
//     password: 'password',
//     dialect: 'postgres',
//     port: 5432
// });
 
const app = express();
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
 
// pool.connect((err, client, release) => {
//     if (err) {
//         return console.error(
//             'Error acquiring client', err.stack)
//     }
//     client.query('SELECT NOW()', (err, result) => {
//         release()
//         if (err) {
//             return console.error(
//                 'Error executing query', err.stack)
//         }
//         console.log("Connected to Database !")
//     })
// })
 
app.get('/status', (req, res) => {
    res.send({
        message: 'hello world!'
    })
})

// app.get('/testdata', (req, res, next) => {
//     console.log("TEST DATA :");
//     pool.query('Select * from test')
//         .then(testData => {
//             console.log(testData);
//             res.send(testData.rows);
//         })
// })
 
// // Require the Routes API 
// // Create a Server and run it on the port 3000
// const server = app.listen(3000, function () {
//     let host = server.address().address
//     let port = server.address().port
//     // Starting the Server at the port 3000
// })


app.listen(process.env.PORT || 8081)
