//This is for the system environment settings
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mariadb = require('mariadb');

//Create the express app object.
const app = express();
//Set the port being used from either the system variable or use
// the default of 3000
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//Set up the maria db
const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password:  process.env.DB_PASSWORD,
    connectionLimit: 5});
 
async function asyncFunction() {
    let conn;
    try {
        console.log('Attempting to connect to the database.');
        conn = await pool.getConnection();
        console.log('Connected to the database.');
   
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) {
          conn.release(); //release to pool
      }
      console.log('Disconnected from the database.');
    }
}

asyncFunction().catch( e => {
    console.log(e);
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    console.log(req.body);
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.use(function (req, res, next) {
    res.render('404')
});

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}.`);
});