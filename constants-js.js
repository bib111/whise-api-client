/**
 * Constants used throughout the API client
 */

// Base URL for the Whise API
const DEFAULT_BASE_URL = 'https://api.whise.eu';

// Token expiry time in milliseconds (23 hours)
const TOKEN_EXPIRY_MS = 23 * 60 * 60 * 1000;

// Lookup data URLs - these contain Whise Internal IDs
const LOOKUP_DATA = {
  CATEGORY: 'https://api.whise.eu/reference?item=category',
  SUBCATEGORY: 'https://api.whise.eu/reference?item=subcategory',
  PURPOSE: 'https://api.whise.eu/reference?item=purpose',
  PURPOSE_STATUS: 'https://api.whise.eu/reference?item=purposestatus',
  COUNTRY: 'https://api.whise.eu/reference?item=country',
  LANGUAGE: 'https://api.whise.eu/reference?item=language',
  ESTATE_STATUS: 'https://api.whise.eu/docs/data/estatestatus.json',
  ESTATE_DISPLAY_STATUS: 'https://api.whise.eu/docs/data/estatedisplaystatus.json',
  SUBDETAIL: 'https://api.whise.eu/reference?item=subdetail',
  SUBDETAIL_ENUM: 'https://api.whise.eu/reference?item=enum',
  SUBDETAIL_TYPE: 'https://api.whise.eu/reference?item=subdetailtype'
};

// Event types for webhooks
const WEBHOOK_EVENT_TYPES = [
  'calendar_update',
  'calendar_created',
  'estate_update',
  'estate_created',
  'contact_update',
  'contact_created',
  'user_update',
  'office_update',
  'contact_type_update',
  'contact_title_update',
  'contact_origin_update',
  'region_update',
  'group_estate_shared',
  'group_estate_unshared'
];

// Estate type identifiers
const ESTATE_TYPES = {
  PROJECT: 'project',
  SUB_PROJECT: 'sub-project',
  UNIT: 'unit',
  STANDALONE: 'standalone'
};

module.exports = {
  DEFAULT_BASE_URL,
  TOKEN_EXPIRY_MS,
  LOOKUP_DATA,
  WEBHOOK_EVENT_TYPES,
  ESTATE_TYPES
};
