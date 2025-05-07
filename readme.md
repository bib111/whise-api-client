# Whise API Client

A Node.js client library for the Whise Website Designer API.

## Overview

This library provides a simple interface to interact with the Whise API for website developers. It handles authentication, token management, and provides methods for accessing estates, contacts, calendars, and administrative endpoints.

## Installation

```bash
npm install whise-api-client
```

## Quick Start

```javascript
const WhiseClient = require('whise-api-client');

// Initialize the client
const whise = new WhiseClient({
  username: 'your-marketplace-username',
  password: 'your-marketplace-password'
});

// Get estates
async function getEstates() {
  try {
    // This will automatically handle authentication
    const estates = await whise.estates.list({
      Page: {
        Limit: 10,
        Offset: 0
      },
      Filter: {
        ShowDetails: true,
        ShowRepresentatives: true
      }
    });
    
    console.log(`Found ${estates.totalCount} estates`);
    console.log(estates.estates);
  } catch (error) {
    console.error('Error fetching estates:', error);
  }
}

getEstates();
```

## Features

- Automatic token management and renewal
- Complete coverage of the Whise Website Designer API endpoints
- Utility functions for common operations
- Webhook handling support
- Type definitions for TypeScript users

## Authentication Flow

1. **Marketplace Authentication**: Using your Marketplace account credentials
2. **Client Authentication**: After connecting a client to your Marketplace account

## API Reference

### Authentication

```javascript
// Initialize with credentials
const whise = new WhiseClient({
  username: 'your-username',
  password: 'your-password'
});

// Get a client token
const clientToken = await whise.auth.getClientToken(clientId, officeId);
```

### Estates

```javascript
// List estates
const estates = await whise.estates.list(options);

// Get estates owned by a contact
const ownedEstates = await whise.estates.getOwned(contactUsername, contactPassword, options);

// Get estate regions
const regions = await whise.estates.getRegions();
```

### Contacts

```javascript
// Create a contact
const contactId = await whise.contacts.create({
  Name: 'John Doe',
  PrivateEmail: 'john.doe@example.com',
  CountryId: 1,
  LanguageId: 'en-GB',
  OfficeIds: [123]
});

// Upsert a contact (create or update)
const contactId = await whise.contacts.upsert({
  Name: 'John Doe',
  PrivateEmail: 'john.doe@example.com',
  CountryId: 1,
  LanguageId: 'en-GB',
  OfficeIds: [123]
});
```

### Calendars

```javascript
// List calendars
const calendars = await whise.calendars.list(options);

// Create/update calendar
const calendarId = await whise.calendars.upsert({
  Subject: 'Property viewing',
  CalendarActionId: 1,
  StartDateTime: '2023-01-01T14:00:00',
  EndDateTime: '2023-01-01T15:00:00',
  UserIds: [123],
  EstateIds: [456],
  ContactIds: [789]
});
```

### Admin

```javascript
// Get list of clients
const clients = await whise.admin.getClients();

// Get list of offices
const offices = await whise.admin.getOffices(clientId);

// Get list of representatives
const representatives = await whise.admin.getRepresentatives(officeId);
```

## Webhook Handler

```javascript
const webhookHandler = whise.webhook.createHandler();

webhookHandler.on('estate_update', (event) => {
  console.log('Estate updated:', event.objectId);
});

// Express example
app.post('/webhook', (req, res) => {
  webhookHandler.process(req.body);
  res.status(200).send('OK');
});
```

## Requirements

- Node.js 14.x or higher
- An active Whise Marketplace account

## License

MIT
