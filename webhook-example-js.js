/**
 * Webhook handler example
 * Shows how to create a simple Express server to handle Whise webhooks
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const WhiseClient = require('../src');

// Create Express app
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Initialize the Whise client
const whise = new WhiseClient({
  username: process.env.WHISE_USERNAME,
  password: process.env.WHISE_PASSWORD
});

// Set up webhook event handlers
const webhook = whise.webhook;

// Listen for all events
webhook.on('all', (event) => {
  console.log(`[${new Date().toISOString()}] Received event: ${event.name}`);
  console.log(`  Client: ${event.clientId}, Office: ${event.officeId}, User: ${event.userId}`);
  console.log(`  Object ID: ${event.objectId}`);
  console.log('---');
});

// Listen for specific events
webhook.on('estate_update', async (event) => {
  console.log(`[${new Date().toISOString()}] Estate update detected - ID: ${event.objectId}`);
  
  try {
    // Set client based on the webhook data
    await whise.setClient(event.clientId, event.officeId);
    
    // Fetch the updated estate
    const estateResponse = await whise.estates.list({
      Filter: {
        EstateIds: [event.objectId],
        ShowDetails: true
      }
    });
    
    if (estateResponse.estates && estateResponse.estates.length > 0) {
      const updatedEstate = estateResponse.estates[0];
      console.log(`Updated estate details:`);
      console.log(`  Name: ${updatedEstate.name || 'N/A'}`);
      console.log(`  City: ${updatedEstate.city || 'N/A'}`);
      console.log(`  Price: ${updatedEstate.price || 'N/A'} ${updatedEstate.currency || ''}`);
      console.log(`  Status: ${updatedEstate.status?.name || updatedEstate.statusId || 'N/A'}`);
    } else {
      console.log(`Could not find estate with ID: ${event.objectId}`);
    }
  } catch (error) {
    console.error(`Error fetching updated estate: ${error.message}`);
  }
});

webhook.on('contact_update', (event) => {
  console.log(`[${new Date().toISOString()}] Contact update detected - ID: ${event.objectId}`);
  // Here you could fetch the updated contact details
});

webhook.on('calendar_update', (event) => {
  console.log(`[${new Date().toISOString()}] Calendar update detected - ID: ${event.objectId}`);
  // Here you could fetch the updated calendar details
});

// Set up the webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Received webhook request');
  
  try {
    // Process the webhook payload
    webhook.process(req.body);
    
    // Respond with 200 OK
    res.status(200).send('OK');
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    res.status(400).send('Invalid webhook payload');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
  console.log('Supported webhook events:');
  webhook.getSupportedEvents().forEach(eventType => {
    console.log(`- ${eventType}`);
  });
  console.log('\nUse a service like ngrok to expose this server to the internet');
  console.log('Then configure your webhook URL in Whise Marketplace > Settings');
});
