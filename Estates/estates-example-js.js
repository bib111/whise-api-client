/**
 * Estates listing example
 * Shows how to list estates and work with different estate types
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

// Client and office IDs (replace with your values)
const CLIENT_ID = process.env.WHISE_CLIENT_ID;
const OFFICE_ID = process.env.WHISE_OFFICE_ID;

async function runEstatesExample() {
  try {
    // Set client
    await whise.setClient(CLIENT_ID, OFFICE_ID);
    console.log('Client authentication successful!');

    // List estates with basic filtering
    console.log('\nListing estates...');
    const estatesResponse = await whise.estates.list({
      Page: {
        Limit: 10,
        Offset: 0
      },
      Filter: {
        ShowDetails: true,
        ShowRepresentatives: true,
        WithRefDescriptions: true
      }
    });

    console.log(`Found ${estatesResponse.totalCount} estates`);
    
    if (estatesResponse.estates && estatesResponse.estates.length > 0) {
      // Display basic estate info
      console.log('\nBasic estate info:');
      estatesResponse.estates.forEach(estate => {
        console.log(`- ID: ${estate.id}, Name: ${estate.name || 'N/A'}, City: ${estate.city || 'N/A'}`);
        
        // Check estate type
        const estateType = whise.estates.identifyEstateType(estate);
        console.log(`  Type: ${estateType}`);
        
        // Display price if available
        if (estate.price) {
          console.log(`  Price: ${estate.price} ${estate.currency || ''}`);
        }
        
        // Display short description if available
        if (estate.shortDescription && estate.shortDescription.length > 0) {
          console.log(`  Description: ${estate.shortDescription[0].content}`);
        }
        
        console.log(''); // Add empty line for readability
      });
    }

    // Get projects
    console.log('\nListing projects...');
    const projectsResponse = await whise.estates.getProjects({
      Page: {
        Limit: 5,
        Offset: 0
      }
    });

    console.log(`Found ${projectsResponse.totalCount} projects`);
    
    if (projectsResponse.estates && projectsResponse.estates.length > 0) {
      const firstProject = projectsResponse.estates[0];
      console.log(`\nGetting units for project: ${firstProject.name || firstProject.id}`);
      
      // Get project with its units
      const projectWithUnits = await whise.estates.getProjectWithUnits(firstProject.id);
      
      console.log(`Project has ${projectWithUnits.totalCount} units`);
      
      // Display units
      if (projectWithUnits.estates && projectWithUnits.estates.length > 0) {
        console.log('\nUnits:');
        projectWithUnits.estates
          .filter(estate => whise.estates.identifyEstateType(estate) === 'unit')
          .forEach(unit => {
            console.log(`- ID: ${unit.id}, Name: ${unit.name || 'N/A'}`);
          });
      }
    }
    
    // Get used cities
    console.log('\nGetting used cities...');
    const citiesResponse = await whise.estates.getUsedCities();
    
    if (citiesResponse.cities && citiesResponse.cities.length > 0) {
      console.log(`Found ${citiesResponse.cities.length} cities:`);
      citiesResponse.cities.slice(0, 5).forEach(city => {
        console.log(`- ${city.name} (${city.zip})`);
      });
      
      if (citiesResponse.cities.length > 5) {
        console.log(`... and ${citiesResponse.cities.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
runEstatesExample().catch(console.error);
