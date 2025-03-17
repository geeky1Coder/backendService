const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const { appendToFile } = require('./utils/fileHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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

// Start the server
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});