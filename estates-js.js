/**
 * Estates API module
 */
const axios = require('axios');
const { DEFAULT_BASE_URL } = require('../utils/constants');

class Estates {
  /**
   * @param {Object} auth - Auth instance
   */
  constructor(auth) {
    this.auth = auth;
    this.baseUrl = auth.config.baseUrl || DEFAULT_BASE_URL;
  }

  /**
   * Get estates list
   * @param {Object} options - Query options
   * @param {Object} [options.Filter] - Filter options
   * @param {Object} [options.Page] - Pagination options
   * @param {Array} [options.Sort] - Sort options
   * @param {Object} [options.Field] - Field inclusion/exclusion
   * @returns {Promise<Object>} Estates response
   */
  async list(options = {}) {
    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/list`,
        options,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching estates');
    }
  }

  /**
   * Get estates owned by contact
   * @param {string} contactUsername - Contact's username
   * @param {string} contactPassword - Contact's password
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Owned estates response
   */
  async getOwned(contactUsername, contactPassword, options = {}) {
    const headers = await this.auth.getClientHeaders();
    
    const payload = {
      ContactUsername: contactUsername,
      ContactPassword: contactPassword,
      ...options
    };
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/owned/list`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching owned estates');
    }
  }

  /**
   * Get regions list
   * @param {string} [languageId] - Language ID
   * @returns {Promise<Object>} Regions response
   */
  async getRegions(languageId = null) {
    const headers = await this.auth.getClientHeaders();
    
    const payload = languageId ? { LanguageId: languageId } : {};
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/regions/list`,
        payload,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching regions');
    }
  }

  /**
   * Get sub-details list
   * @param {Object} options - Query options
   * @param {Array} [options.CategoryIds] - Category IDs
   * @param {boolean} [options.IncludeInactive] - Include inactive sub-details
   * @param {string} [options.LanguageId] - Language ID
   * @returns {Promise<Object>} Sub-details response
   */
  async getDetails(options = {}) {
    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/details/list`,
        options,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching sub-details');
    }
  }

  /**
   * Get used cities list
   * @param {Object} [estateFilter] - Estate filter
   * @returns {Promise<Object>} Cities response
   */
  async getUsedCities(estateFilter = {}) {
    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/usedcities/list`,
        { EstateFilter: estateFilter },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching used cities');
    }
  }

  /**
   * Get used countries list
   * @param {Object} [estateFilter] - Estate filter
   * @returns {Promise<Object>} Countries response
   */
  async getUsedCountries(estateFilter = {}) {
    const headers = await this.auth.getClientHeaders();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/estates/usedcountries/list`,
        { EstateFilter: estateFilter },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching used countries');
    }
  }

  /**
   * Helper to identify if an estate is a project, sub-project, unit, or standalone
   * @param {Object} estate - Estate object
   * @returns {string} Estate type
   */
  identifyEstateType(estate) {
    if (estate.canHaveChildren === true && !estate.parentId) {
      return 'project';
    } else if (estate.canHaveChildren === true && estate.parentId) {
      return 'sub-project';
    } else if (!estate.canHaveChildren && estate.parentId) {
      return 'unit';
    } else {
      return 'standalone';
    }
  }

  /**
   * Get projects list
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects response
   */
  async getProjects(options = {}) {
    const projectOptions = {
      ...options,
      Filter: {
        ...(options.Filter || {}),
        IsTopParent: true
      }
    };
    
    return this.list(projectOptions);
  }

  /**
   * Get specific project with all its units
   * @param {number} projectId - Project ID
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Project with units response
   */
  async getProjectWithUnits(projectId, options = {}) {
    const projectOptions = {
      ...options,
      Filter: {
        ...(options.Filter || {}),
        ProjectId: projectId
      }
    };
    
    return this.list(projectOptions);
  }

  /**
   * Get sub-projects list
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Sub-projects response
   */
  async getSubProjects(options = {}) {
    const subProjectOptions = {
      ...options,
      Filter: {
        ...(options.Filter || {}),
        IsTopParent: false,
        CanHaveChildren: true
      }
    };
    
    return this.list(subProjectOptions);
  }

  /**
   * Get standalone estates list
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Standalone estates response
   */
  async getStandaloneEstates(options = {}) {
    const standaloneOptions = {
      ...options,
      Filter: {
        ...(options.Filter || {}),
        HasParent: false,
        CanHaveChildren: false
      }
    };
    
    return this.list(standaloneOptions);
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

module.exports = Estates;
