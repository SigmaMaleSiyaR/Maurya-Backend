const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use the PORT provided by Render or fallback to 5000
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
        <p>Use the URL <code>https://your-render-url.onrender.com/webhook</code> in Dialogflow Fulfillment settings.</p>
    `);
});

// Dialogflow webhook endpoint
app.post('/webhook', (req, res) => {
    console.log("POST request received at /webhook");
    console.time('webhookRequestTime');

    try {
        console.info('Request received at /webhook endpoint');
        
        // Log request body and headers for debugging
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
        console.log('Request Headers:', req.headers);

        // Extract data from the Dialogflow request
        const userQuery = req.body.queryResult?.queryText || 'No queryText provided';
        const intent = req.body.queryResult?.intent?.displayName || 'No intent name provided';
        const parameters = req.body.queryResult?.parameters || {};
        const fulfillmentText = req.body.queryResult?.fulfillmentText || '';

        // Log details for debugging
        console.log('User Query:', userQuery);
        console.log('Intent:', intent);
        console.log('Parameters:', parameters);

        // Save log data
        logs.push({
            timestamp: new Date(),
            userQuery,
            intent,
            parameters,
            botResponse: fulfillmentText,
        });

        // Respond to Dialogflow
        res.json({
            fulfillmentText: `Webhook processed your message: "${userQuery}" under intent "${intent}".`,
        });

        console.info('Webhook request processed successfully');
    } catch (error) {
        console.error('Error in /webhook:', error.message);
        res.status(500).send('Error processing webhook');
    }

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
    console.log('To connect this server to Dialogflow:');
    console.log(`- Deploy this app on Render.`);
    console.log('- Use the generated Render URL as your webhook in Dialogflow Fulfillment settings:');
    console.log('  Example: https://your-render-url.onrender.com/webhook');
});
