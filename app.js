const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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

    // Append data followed by the marker
    const entry = JSON.stringify(data) + '\n---END---\n';

    appendToFile(entry)
        .then(() => {
            res.status(200).send('Data appended successfully');
        })
        .catch((error) => {
            console.error('Error appending data:', error);
            res.status(500).send('Error appending data: ' + error.message);
        });
});

// GET request to retrieve the latest content of the data file
app.get('/latest-data', (req, res) => {
    const filePath = path.join(__dirname, 'utils', 'data.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file: ' + err.message);
        }

        // Split the file content into entries using the marker
        const entries = data.split('---END---');

        // Find the last valid entry (ignoring empty entries)
        const latestData = entries
            .map(entry => entry.trim())
            .filter(entry => entry.length > 0)
            .pop();

        if (!latestData) {
            return res.status(404).send({ message: 'No valid data found.' });
        }

        res.status(200).send({ latestData });
    });
});

// GET request to retrieve all content of the data file
app.get('/all-data', (req, res) => {
    const filePath = path.join(__dirname, 'utils', 'data.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file: ' + err.message);
        }

        // Split the file content into entries using the marker
        const entries = data.split('---END---');

        // Filter out empty entries and trim whitespace
        const allData = entries
            .map(entry => entry.trim())
            .filter(entry => entry.length > 0);

        if (allData.length === 0) {
            return res.status(404).send({ message: 'No valid data found.' });
        }

        res.status(200).send({ allData });
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