/**
 * Authentication example
 * Shows how to initialize the client and authenticate with Whise API
 */
require('dotenv').config();
const WhiseClient = require('../src');

// Get credentials from environment variables
const credentials = {
  username: process.env.WHISE_USERNAME,
  password: process.env.WHISE_PASSWORD
};

// Initialize the client
const whise = new WhiseClient(credentials);

async function runAuthExample() {
  try {
    // Step 1: Get authentication token
    console.log('Getting authentication token...');
    const token = await whise.auth.getToken();
    console.log('Authentication successful!');

    // Step 2: List available clients
    console.log('\nListing available clients...');
    const clientsResponse = await whise.admin.getClients();
    
    if (!clientsResponse.Clients || clientsResponse.Clients.length === 0) {
      console.log('No clients available. Make sure your Marketplace account has clients activated.');
      return;
    }
    
    console.log(`Found ${clientsResponse.TotalCount} clients:`);
    clientsResponse.Clients.forEach(client => {
      console.log(`- ID: ${client.Id}, Name: ${client.Name}`);
    });
    
    // Step 3: Get a client token for the first client
    const firstClient = clientsResponse.Clients[0];
    console.log(`\nGetting client token for ${firstClient.Name} (ID: ${firstClient.Id})...`);
    
    // Set the client in the API client
    await whise.setClient(firstClient.Id);
    
    console.log('Client authentication successful!');
    console.log('You can now use the client API endpoints.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
runAuthExample().catch(console.error);
