/**
 * Contacts API module
 */
const axios = require('axios');
const { DEFAULT_BASE_URL } = require('../utils/constants');

class Contacts {
  /**
   * @param {Object} auth - Auth instance
   */
  constructor(auth) {
    this.auth = auth;
    this.baseUrl = auth.config.baseUrl || DEFAULT_BASE_URL;
  }

  /**
   * Create a new contact
   * @param {Object} contact - Contact data
   * @param {string} contact.Name - Contact name (required)
   * @param {string} [contact.FirstName] - Contact first name
   * @param {string} [contact.PrivateEmail] - Contact email
   * @param {number} contact.CountryId - Country ID (required)
   * @param {string} contact.LanguageId - Language ID (required)
   * @param {Array<number>} contact.OfficeIds - Office IDs (required)
   * @returns {Promise<Object>} Contact creation response
   */
  async create(contact) {
    if (!contact.Name) throw new Error('Contact name is required');
    if (!contact.CountryId) throw new Error('Country ID is required');
    if (!contact.LanguageId) throw new Error('Language ID is required');
    if (!contact.OfficeIds || !contact.OfficeIds.length) {
      throw new Error('At least one Office ID is required');
    }

    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/contacts/create`,
        contact,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error creating contact');
    }
  }

  /**
   * Create or update a contact
   * @param {Object} contact - Contact data
   * @param {string} contact.Name - Contact name (required)
   * @param {string} contact.PrivateEmail - Contact email (required)
   * @param {number} contact.CountryId - Country ID (required)
   * @param {string} contact.LanguageId - Language ID (required)
   * @param {Array<number>} contact.OfficeIds - Office IDs (required)
   * @returns {Promise<Object>} Contact upsert response
   */
  async upsert(contact) {
    if (!contact.Name) throw new Error('Contact name is required');
    if (!contact.PrivateEmail) throw new Error('Contact email is required');
    if (!contact.CountryId) throw new Error('Country ID is required');
    if (!contact.LanguageId) throw new Error('Language ID is required');
    if (!contact.OfficeIds || !contact.OfficeIds.length) {
      throw new Error('At least one Office ID is required');
    }

    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/contacts/upsert`,
        contact,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error upserting contact');
    }
  }

  /**
   * Get contact origins list
   * @param {string} [languageId] - Language ID
   * @returns {Promise<Object>} Contact origins response
   */
  async getOrigins(languageId = null) {
    const headers = await this.auth.getClientHeaders();
    
    const payload = languageId ? { LanguageId: languageId } : {};
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/contacts/origins/list`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching contact origins');
    }
  }

  /**
   * Get contact titles list
   * @param {string} [languageId] - Language ID
   * @returns {Promise<Object>} Contact titles response
   */
  async getTitles(languageId = null) {
    const headers = await this.auth.getClientHeaders();
    
    const payload = languageId ? { LanguageId: languageId } : {};
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/contacts/titles/list`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching contact titles');
    }
  }

  /**
   * Get contact types list
   * @param {string} [languageId] - Language ID
   * @returns {Promise<Object>} Contact types response
   */
  async getTypes(languageId = null) {
    const headers = await this.auth.getClientHeaders();
    
    const payload = languageId ? { LanguageId: languageId } : {};
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/contacts/types/list`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching contact types');
    }
  }

  /**
   * Create a contact with search criteria
   * @param {Object} contact - Contact data
   * @param {Array} searchCriteria - Search criteria
   * @returns {Promise<Object>} Contact creation response
   */
  async createWithSearchCriteria(contact, searchCriteria) {
    const contactData = {
      ...contact,
      SearchCriteria: searchCriteria
    };
    
    return this.create(contactData);
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @throws {Error} Enhanced error
   */
  _handleError(error, defaultMessage) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || defaultMessage;
      throw new Error(`${message} (${status}): ${JSON.stringify(data)}`);
    }
    throw error;
  }
}

module.exports = Contacts;
