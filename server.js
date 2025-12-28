const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Set view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the HTML directory
app.use('/HTML', express.static(path.join(__dirname, 'HTML')));

// Route for the homepage
app.get('/', (req, res) => {
    const htmlDir = path.join(__dirname, 'HTML');

    // Check if HTML directory exists
    if (!fs.existsSync(htmlDir)) {
        return res.send('HTML directory not found. Please create a folder named "HTML" and add your html files there.');
    }

    fs.readdir(htmlDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }

        // Filter for .html files
        const htmlFiles = files.filter(file => file.endsWith('.html'));

        const parsedFiles = htmlFiles.map(file => {
            // Regex to parse filename: {date-iso}-{hours-locale}-{minutes-locale}-{seconds-locale}-{title}.html
            // Example: 2025-12-21-20-11-11-Title.html
            const regex = /^(\d{4}-\d{2}-\d{2})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(.*)\.html$/;
            const match = file.match(regex);

            if (match) {
                return {
                    filename: file,
                    date: match[1],
                    time: `${match[2]}:${match[3]}:${match[4]}`,
                    title: match[5],
                    timestamp: new Date(`${match[1]}T${match[2]}:${match[3]}:${match[4]}`).getTime()
                };
            } else {
                // Fallback for files that don't match the pattern
                return {
                    filename: file,
                    date: 'Unknown',
                    time: 'Unknown',
                    title: file,
                    timestamp: 0
                };
            }
        });

        // Sort by timestamp descending (newest first)
        parsedFiles.sort((a, b) => b.timestamp - a.timestamp);

        res.render('index', { files: parsedFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
