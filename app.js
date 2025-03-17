const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const { appendToFile } = require('./utils/fileHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line
app.use(bodyParser.json());

// POST request to append data to a file
app.post('/data', (req, res) => {
    const data = req.body;
    console.log(data);
    // Validate the request body
    if (!data || typeof data !== 'object') {
        return res.status(400).send('Invalid data');
    }

    appendToFile(JSON.stringify(data) + '\n')
        .then(() => {
            res.status(200).send('Data appended successfully');
        })
        .catch((error) => {
            console.error('Error appending data:', error);
            res.status(500).send('Error appending data: ' + error.message);
        });
});

// GET request to check API status
app.get('/status', (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Status</title>
        </head>
        <body>
            <h1>API Status</h1>
            <p>The API is running successfully!</p>
        </body>
        </html>
    `);
});

// Try to load SSL certificates
let server;
try {
    const sslOptions = {
        key: fs.readFileSync('./example.com+5-key.pem'),
        cert: fs.readFileSync('./example.com+5.pem'),
    };
    server = https.createServer(sslOptions, app);
} catch (error) {
    console.error('Failed to load SSL certificates, falling back to HTTP:', error.message);
    server = http.createServer(app);
}

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});