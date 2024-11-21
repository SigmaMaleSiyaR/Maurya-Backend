const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Dialogflow webhook endpoint
app.post('/webhook', (req, res) => {
    // Extract user query and intent data from the request
    const userQuery = req.body.queryResult.queryText; // User's query
    const intent = req.body.queryResult.intent.displayName; // Intent name
    const parameters = req.body.queryResult.parameters; // Parameters filled by entities
    const fulfillmentText = req.body.queryResult.fulfillmentText; // Dialogflow's response text

    // Log the extracted data to the console
    console.log('User Query:', userQuery);
    console.log('Matched Intent:', intent);
    console.log('Parameters:', parameters);
    console.log('Dialogflow Response:', fulfillmentText);

    // Respond back to Dialogflow with the fulfillment text
    res.json({
        fulfillmentText: `You said: "${userQuery}". This intent is: "${intent}".`,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//just a change
