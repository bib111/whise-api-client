/**
 * Authentication manager for Whise API
 */
const axios = require('axios');

class Auth {
  /**
   * @param {Object} config - Config object
   * @param {string} config.username - Marketplace account username
   * @param {string} config.password - Marketplace account password
   * @param {string} config.baseUrl - API base URL
   * @param {boolean} config.autoRenewTokens - Whether to automatically renew tokens
   */
  constructor(config) {
    this.config = config;
    this.token = null;
    this.clientToken = null;
    this.clientId = null;
    this.officeId = null;
    this.tokenExpiry = null;
    this.clientTokenExpiry = null;
    
    // Token expiry is set to 23 hours to be safe (actual expiry is 24 hours)
    this.tokenExpiryMs = 23 * 60 * 60 * 1000;
  }

  /**
   * Get marketplace authentication token
   * @returns {Promise<string>} Authentication token
   */
  async getToken() {
    // Check if token exists and is still valid
    if (this.token && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.token;
    }

    try {
      const response = await axios.post(`${this.config.baseUrl}/token`, {
        username: this.config.username,
        password: this.config.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.tokenExpiry = Date.now() + this.tokenExpiryMs;
        return this.token;
      } else {
        throw new Error('No token returned from authentication');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(`Authentication failed: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Get client token for specific client
   * @param {number} clientId - Client ID
   * @param {number} [officeId] - Optional office ID
   * @returns {Promise<string>} Client token
   */
  async getClientToken(clientId, officeId = null) {
    // Check if we already have a valid client token for this client
    if (
      this.clientToken && 
      this.clientTokenExpiry && 
      this.clientTokenExpiry > Date.now() &&
      this.clientId === clientId &&
      this.officeId === officeId
    ) {
      return this.clientToken;
    }

    // Get main token first
    const token = await this.getToken();

    try {
      const payload = {
        ClientId: clientId
      };

      if (officeId) {
        payload.OfficeId = officeId;
      }

      const response = await axios.post(
        `${this.config.baseUrl}/v1/admin/clients/token`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.token) {
        this.clientToken = response.data.token;
        this.clientTokenExpiry = Date.now() + this.tokenExpiryMs;
        this.clientId = clientId;
        this.officeId = officeId;
        return this.clientToken;
      } else {
        throw new Error('No client token returned');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(`Client token retrieval failed: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Set client token for requests
   * @param {number} clientId - Client ID
   * @param {number} [officeId] - Optional office ID
   * @returns {Promise<void>}
   */
  async setClientToken(clientId, officeId = null) {
    this.clientId = clientId;
    this.officeId = officeId;
    // Force refresh token
    this.clientToken = null;
    this.clientTokenExpiry = null;
    await this.getClientToken(clientId, officeId);
  }

  /**
   * Get authorization header for marketplace requests
   * @returns {Promise<Object>} Headers object
   */
  async getHeaders() {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Get authorization header for client requests
   * @param {number} [clientId] - Optional client ID (if not already set)
   * @param {number} [officeId] - Optional office ID (if not already set)
   * @returns {Promise<Object>} Headers object
   */
  async getClientHeaders(clientId = null, officeId = null) {
    // If clientId is provided, use it, otherwise use the one already set
    const cId = clientId || this.clientId;
    const oId = officeId || this.officeId;

    if (!cId) {
      throw new Error('Client ID is required for client requests');
    }

    const token = await this.getClientToken(cId, oId);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}

module.exports = Auth;
