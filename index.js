const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // Backend runs on port 5000
const logs = [];

// Enable CORS to allow frontend access
app.use(cors());
app.use(bodyParser.json());

// GET /webhook for initial access
app.get('/webhook', (req, res) => {
    console.log('GET request received at /webhook');
    res.send(`
        <h1>Webhook Server is Running</h1>
        <p>The webhook endpoint is active and ready to receive POST requests from Dialogflow.</p>
    `);
});

// Dialogflow webhook endpoint
app.post('/webhook', (req, res) => {
    // Start measuring the time for processing the request
    console.time('webhookRequestTime');

    try {
        console.info('Request received at /webhook endpoint');
        
        // Log request body and headers for debugging
        console.table(req.body); // Visualize the body in a table format
        console.log('Request Headers:', req.headers);

        const userQuery = req.body.queryResult.queryText;
        const intent = req.body.queryResult.intent.displayName;
        const parameters = req.body.queryResult.parameters;
        const fulfillmentText = req.body.queryResult.fulfillmentText;

        // Log detailed data about the request
        console.log('User Query:', userQuery);
        console.log('Intent:', intent);
        console.log('Parameters:', parameters);

        // Save log data
        logs.push({
            userQuery,
            intent,
            parameters,
            botResponse: fulfillmentText,
        });

        // Respond to Dialogflow
        res.json({
            fulfillmentText: `Received your message: "${userQuery}" for intent "${intent}".`,
        });

        console.info('Processed the webhook successfully');
    } catch (error) {
        console.error('Error in /webhook:', error.message);
        res.status(500).send('Error processing webhook');
    }

    // End the time measurement for the request
    console.timeEnd('webhookRequestTime');
});

// Logs endpoint for the frontend
app.get('/logs', (req, res) => {
    console.log('Fetching logs...');
    res.json(logs);
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log(`You can access the webhook page at http://localhost:${PORT}/webhook`);
});
