const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const htmlDir = path.join(__dirname, 'HTML');
const templatePath = path.join(__dirname, 'views', 'index.ejs');
const outputPath = path.join(__dirname, 'index.html');

// Check if HTML directory exists
if (!fs.existsSync(htmlDir)) {
    console.error('HTML directory not found.');
    process.exit(1);
}

// Read HTML directory
const files = fs.readdirSync(htmlDir);

// Filter for .html files
const htmlFiles = files.filter(file => file.endsWith('.html'));

const parsedFiles = htmlFiles.map(file => {
    // Regex to parse filename: {date-iso}-{hours-locale}-{minutes-locale}-{seconds-locale}-{title}.html
    const regex = /^(\d{4}-\d{2}-\d{2})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(.*)\.html$/;
    const match = file.match(regex);

    if (match) {
        return {
            filename: file,
            encodedFilename: encodeURIComponent(file),
            date: match[1],
            time: `${match[2]}:${match[3]}:${match[4]}`,
            title: match[5],
            timestamp: new Date(`${match[1]}T${match[2]}:${match[3]}:${match[4]}`).getTime()
        };
    } else {
        // Fallback for files that don't match the pattern
        return {
            filename: file,
            encodedFilename: encodeURIComponent(file),
            date: 'Unknown',
            time: 'Unknown',
            title: file,
            timestamp: 0
        };
    }
});

// Sort by timestamp descending (newest first)
parsedFiles.sort((a, b) => b.timestamp - a.timestamp);

// Render template
fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
        console.error('Error reading template:', err);
        return;
    }

    const html = ejs.render(template, { files: parsedFiles });

    fs.writeFile(outputPath, html, (err) => {
        if (err) {
            console.error('Error writing index.html:', err);
        } else {
            console.log('Successfully generated index.html');
        }
    });
});
