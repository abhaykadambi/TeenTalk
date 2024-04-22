const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Twilio webhook endpoint
app.post('/webhook', (req, res) => {
    const twiml = new MessagingResponse();
    console.log(req.body.Body)
    res.type('text/xml').send(twiml.toString());
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
