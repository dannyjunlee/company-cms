// Dependencies
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const router = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('./', router);

// Establish MySQL connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '1!Tjalswjd132',
        database: 'company_db'
    },
    console.log('Connected to company_db database')
);

// End if 404
app.use((req, res) => {
    res.status(404).end();
});

// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});