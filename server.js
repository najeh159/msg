const express = require('express')
const ejs = require('ejs')

const app = express();
app.use(express.json());

// Use dynamic import for node-fetch
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define a route to render the EJS view
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

app.get('/msg', (req, res) => {
  const name = req.query.name; // Get the name from the query parameters
  res.render('index2', { name }); // Pass the name to the index2.ejs file
});

// Handle the response from the buttons
app.post('/response', async (req, res) => {
    const { response, name } = req.body;
    const webhookUrl = 'https://discord.com/api/webhooks/1324050488777379881/f93LGiY3apqXLae-BBmD1NO6oLcENoQguEa2gIsKexko2_cXBUljz9FsEKe1aEnXYCym'; // Your Discord webhook URL

    const message = `${name} clicked "${response}"!`;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            body: JSON.stringify({ content: message }),
            headers: { 'Content-Type': 'application/json' },
        });
        res.json({ message: 'Response sent to Discord!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending message to Discord.' });
    }
});

app.listen(3000,() => {
  console.log('running on http://localhost:3000')
})