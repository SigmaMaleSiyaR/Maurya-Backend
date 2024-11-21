const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // Backend runs on port 5000
const logs = [];

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

// Dialogflow webhook endpoint
app.post('/webhook', (req, res) => {
    const userQuery = req.body.queryResult.queryText;
    const intent = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    const fulfillmentText = req.body.queryResult.fulfillmentText;

    // Save log data
    logs.push({
        userQuery,
        intent,
        parameters,
        botResponse: fulfillmentText,
    });

    console.log('Log:', { userQuery, intent, parameters, fulfillmentText });

    // Respond to Dialogflow
    res.json({
        fulfillmentText: `Received your message: "${userQuery}" for intent "${intent}".`,
    });
});

// Logs endpoint for the frontend
app.get('/logs', (req, res) => {
    res.json(logs);
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
