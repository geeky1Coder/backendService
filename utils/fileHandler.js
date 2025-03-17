const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.txt'); // Specify the file to append data to

const appendToFile = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data);
        fs.appendFile(filePath, `${data}\n`, (err) => {
            if (err) {
                reject(err); // Reject the Promise if there's an error
            } else {
                resolve(); // Resolve the Promise if successful
            }
        });
    });
};

module.exports = { appendToFile }; // Use named export