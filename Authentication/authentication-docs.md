# Authentication

This document explains the authentication process for the Whise API.

## Overview

The Whise API uses a two-level authentication system:

1. **Marketplace Authentication**: Authenticates your Marketplace account
2. **Client Authentication**: Authenticates for a specific client connected to your Marketplace account

Both levels use JWT tokens with a 24-hour expiry period. The library handles token renewal automatically.

## Marketplace Account Setup

Before you can use the API, you need to:

1. Create a Marketplace account on Whise
2. Wait for account approval (it may start in "Pending" status)
3. Request client connections by emailing `api@whise.eu` with the client in CC

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Marketplace │     │ Marketplace │     │   Client    │
│ Credentials │──►  │    Token    │──►  │    Token    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Usage

### Initialize the client

```javascript
const WhiseClient = require('whise-api-client');

const whise = new WhiseClient({
  username: 'your-marketplace-username',
  password: 'your-marketplace-password'
});
```

### Get Marketplace token

The library handles this automatically, but you can also get it explicitly:

```javascript
const token = await whise.auth.getToken();
```

### Get Client token

After authenticating with your Marketplace account, you need to get a client token:

```javascript
// Method 1: Set client globally for all requests
await whise.setClient(clientId, officeId);

// Method 2: Get client token explicitly
const clientToken = await whise.auth.getClientToken(clientId, officeId);
```

### List available clients

To see which clients are connected to your Marketplace account:

```javascript
const clientsResponse = await whise.admin.getClients();
console.log(clientsResponse.Clients);
```

## Token Expiry

Tokens expire after 24 hours. The library handles token renewal automatically whenever a token is expired or about to expire.

## Error Handling

Common authentication errors:

- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Account does not have permission
- **404 Not Found**: Client or office not found

Example error handling:

```javascript
try {
  await whise.setClient(clientId, officeId);
  // Proceed with API calls
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Authentication failed. Check your credentials.');
  } else if (error.message.includes('403')) {
    console.error('Your account does not have permission to access this client.');
  } else {
    console.error('Error:', error.message);
  }
}
```
