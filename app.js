//This is for the system environment settings
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

//Create the express app object.
const app = express();
//Set the port being used from either the system variable or use
// the default of 3000
const PORT = process.env.PORT || 3000;
const SALT = 10;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//Set up the maria db pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password:  process.env.DB_PASSWORD,
    database: 'financedb',
    connectionLimit: 5});

const dbconn = {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password:  process.env.DB_PASSWORD,
    database: 'financedb',
    connectionLimit: 5
};

app.get('/', (res, req) => {

});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    //TODO: Check if the  user exists.  If not create user in the databse.
    const email = req.body.email;
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const password = req.body.password;

    mariadb.createConnection(dbconn)
    .then(conn => {
      conn.query("SELECT * FROM user WHERE Email=?", [email])
        .then(rows => {
            if(rows.length == 0)
            {
                console.log('User does not exist, attempting to create record.');
                //Encrypt the password.
                const hash = bcrypt.hash(req.body.password, SALT);  
                return conn.query("INSERT INTO user (FirstName, LastName, Email, PassWord) VALUES(?, ?, ?, ?);", 
                    [fname,lname,email,password]);
            }
            else
            {
                console.log('User record exists.');
                //Add message
                //user exits go to the log in page
                return null;
                
            }
        })
        .then((res) => {
            console.log(res);
            conn.end();
        })
        .catch(err => { 
            console.log(err);
            conn.end();
        });
    })
    .catch(err => {
      console.log(err);
    });
  
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let hashpassword = "";

    //const isMatch = await bcrypt.compare(req.body.password, password);

    //Is it necessaray to use async to log in?s
    try {
        let conn = pool.getConnection();
    } catch (err) {
        console.log(err);
    }
});

app.use(function (req, res, next) {
    res.render('404')
});

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}.`);
});