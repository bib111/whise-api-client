/**
 * Main entry point for the Whise API Client
 */
const Auth = require('./auth');
const Estates = require('./api/estates');
const Contacts = require('./api/contacts');
const Calendars = require('./api/calendars');
const Admin = require('./api/admin');
const Webhook = require('./webhook');
const { DEFAULT_BASE_URL } = require('./utils/constants');

class WhiseClient {
  /**
   * Create a new Whise API client
   * @param {Object} config - Configuration object
   * @param {string} config.username - Marketplace account username
   * @param {string} config.password - Marketplace account password
   * @param {string} [config.baseUrl=DEFAULT_BASE_URL] - API base URL
   * @param {boolean} [config.autoRenewTokens=true] - Whether to automatically renew tokens
   */
  constructor(config = {}) {
    this.config = {
      baseUrl: DEFAULT_BASE_URL,
      autoRenewTokens: true,
      ...config
    };

    if (!this.config.username || !this.config.password) {
      throw new Error('Username and password are required');
    }

    // Initialize auth manager
    this.auth = new Auth(this.config);

    // Initialize API modules
    this.estates = new Estates(this.auth);
    this.contacts = new Contacts(this.auth);
    this.calendars = new Calendars(this.auth);
    this.admin = new Admin(this.auth);
    this.webhook = new Webhook();
  }

  /**
   * Set client for requests
   * @param {number} clientId - The client ID
   * @param {number} [officeId] - Optional office ID
   * @returns {Promise<void>}
   */
  async setClient(clientId, officeId) {
    return this.auth.setClientToken(clientId, officeId);
  }
}

module.exports = WhiseClient;
