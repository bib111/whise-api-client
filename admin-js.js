/**
 * Admin API module
 */
const axios = require('axios');
const { DEFAULT_BASE_URL } = require('../utils/constants');

class Admin {
  /**
   * @param {Object} auth - Auth instance
   */
  constructor(auth) {
    this.auth = auth;
    this.baseUrl = auth.config.baseUrl || DEFAULT_BASE_URL;
  }

  /**
   * Get clients list
   * @param {Object} [options] - Query options
   * @param {Array<number>} [options.ClientIds] - Filter by client IDs
   * @param {string} [options.ClientName] - Filter by client name
   * @param {string} [options.LanguageId] - Filter by language ID
   * @param {Object} [options.Page] - Pagination options
   * @returns {Promise<Object>} Clients response
   */
  async getClients(options = {}) {
    const headers = await this.auth.getHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/admin/clients/list`,
        options,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching clients');
    }
  }

  /**
   * Get client settings
   * @param {number} clientId - Client ID
   * @param {number} [officeId] - Optional office ID
   * @returns {Promise<Object>} Client settings response
   */
  async getClientSettings(clientId, officeId = null) {
    if (!clientId) throw new Error('Client ID is required');

    const headers = await this.auth.getHeaders();
    
    const payload = {
      ClientId: clientId
    };
    
    if (officeId) {
      payload.OfficeId = officeId;
    }
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/admin/clients/settings`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching client settings');
    }
  }

  /**
   * Update client settings
   * @param {number} clientId - Client ID
   * @param {string} detailPageUrl - Detail page URL
   * @returns {Promise<Object>} Update response
   */
  async updateClientSettings(clientId, detailPageUrl) {
    if (!clientId) throw new Error('Client ID is required');
    if (!detailPageUrl) throw new Error('Detail page URL is required');

    const headers = await this.auth.getHeaders();
    
    try {
      const response = await axios.patch(
        `${this.baseUrl}/v1/admin/clients/settings/update`,
        {
          ClientId: clientId,
          DetailPageUrl: detailPageUrl
        },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error updating client settings');
    }
  }

  /**
   * Get offices list
   * @param {Object} [options] - Query options
   * @param {number} [options.ClientId] - Filter by client ID
   * @param {Array<number>} [options.OfficeIds] - Filter by office IDs
   * @param {string} [options.OfficeName] - Filter by office name
   * @param {string} [options.LanguageId] - Filter by language ID
   * @param {Object} [options.Page] - Pagination options
   * @returns {Promise<Object>} Offices response
   */
  async getOffices(options = {}) {
    const headers = await this.auth.getHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/admin/offices/list`,
        options,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching offices');
    }
  }

  /**
   * Get representatives list
   * @param {number} officeId - Office ID
   * @returns {Promise<Object>} Representatives response
   */
  async getRepresentatives(officeId) {
    if (!officeId) throw new Error('Office ID is required');

    const headers = await this.auth.getHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/admin/representatives/list`,
        {
          OfficeId: officeId
        },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching representatives');
    }
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

module.exports = Admin;
