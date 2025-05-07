# Estates API

This document explains how to work with the Estates API in the Whise API client.

## Overview

The Estates API allows you to:

- Retrieve a list of properties (estates)
- Filter estates by various criteria
- Get property details including images, documents, etc.
- Work with projects and units
- Get regional data, cities, countries, etc.

## Basic Usage

```javascript
// Initialize client and authenticate
const whise = new WhiseClient({
  username: 'your-username',
  password: 'your-password'
});

// Set client for all requests
await whise.setClient(clientId, officeId);

// Get list of estates
const estates = await whise.estates.list({
  Page: {
    Limit: 20,
    Offset: 0
  },
  Filter: {
    ShowDetails: true,
    ShowRepresentatives: true,
    WithRefDescriptions: true
  }
});

// Access estate data
console.log(`Found ${estates.totalCount} estates`);
estates.estates.forEach(estate => {
  console.log(`- ${estate.id}: ${estate.name} in ${estate.city}`);
  
  // Access images if available
  if (estate.pictures && estate.pictures.length > 0) {
    console.log(`  Has ${estate.pictures.length} images`);
    console.log(`  First image URL: ${estate.pictures[0].urlLarge}`);
  }
});
```

## Estate Types

The Whise API distinguishes between different types of estates:

1. **Project**: A parent estate that can have child estates (e.g., an apartment building)
2. **Sub-Project**: A child of a project that can also have its own children
3. **Unit**: A child estate that cannot have children (e.g., an individual apartment)
4. **Standalone**: An estate that has no parent and cannot have children

```javascript
// Identify estate type
const estateType = whise.estates.identifyEstateType(estate);
console.log(`Estate type: ${estateType}`); // 'project', 'sub-project', 'unit', or 'standalone'

// Get projects only
const projects = await whise.estates.getProjects();

// Get standalone estates only
const standaloneEstates = await whise.estates.getStandaloneEstates();

// Get a project with all its units
const projectWithUnits = await whise.estates.getProjectWithUnits(projectId);
```

## Filtering

You can filter estates by various criteria:

```javascript
const filteredEstates = await whise.estates.list({
  Filter: {
    // Location filters
    City: 'Brussels',
    ZipCodes: ['1000', '1040'],
    CountryIds: [1], // Belgium
    
    // Property type filters
    CategoryIds: [1], // Residential
    SubCategoryIds: [2], // Apartment
    
    // Price range
    PriceRange: {
      Min: 100000,
      Max: 500000
    },
    
    // Property features
    MinRooms: 2,
    BathRooms: 1,
    Garage: true,
    Terrace: true,
    
    // Status filters
    StatusIds: [1, 6], // Active, Option
    PurposeIds: [1], // For sale
    
    // Datetime filters
    UpdateDateTimeRange: {
      Min: '2023-01-01T00:00:00Z',
      Max: '2023-12-31T23:59:59Z'
    }
  }
});
```

## Sorting and Pagination

```javascript
const sortedEstates = await whise.estates.list({
  Sort: [
    {
      Field: 'price',
      Ascending: true
    },
    {
      Field: 'city',
      Ascending: true
    }
  ],
  Page: {
    Limit: 10, // Items per page
    Offset: 20 // Skip first 20 items (show page 3)
  }
});
```

## Owner Login Feature

To get estates owned by a specific contact (client):

```javascript
const ownedEstates = await whise.estates.getOwned(
  'contact@example.com', // Contact username
  'password123',         // Contact password
  {
    // Optional filters
    Filter: {
      City: 'Brussels'
    },
    Page: {
      Limit: 10,
      Offset: 0
    }
  }
);
```

## Regional Data

```javascript
// Get list of regions
const regions = await whise.estates.getRegions('en-GB');

// Get cities where estates are located
const cities = await whise.estates.getUsedCities();

// Get countries where estates are located
const countries = await whise.estates.getUsedCountries();
```

## Estate Details and Subdetails

```javascript
// Get available estate subdetails (fields)
const details = await whise.estates.getDetails({
  CategoryIds: [1], // Get fields for residential properties
  IncludeInactive: false
});
```
