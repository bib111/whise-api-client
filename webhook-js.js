/**
 * Webhook handler for Whise API
 * Allows processing of webhook events from Whise
 */
const EventEmitter = require('events');

class Webhook extends EventEmitter {
  /**
   * Create a new webhook handler
   */
  constructor() {
    super();
    
    // Set higher limit for event listeners
    this.setMaxListeners(50);
    
    // Known event types
    this.eventTypes = [
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
  }

  /**
   * Process webhook payload
   * @param {Object} payload - Webhook payload
   * @returns {Array} Processed events
   */
  process(payload) {
    if (!payload || !payload.events || !Array.isArray(payload.events)) {
      throw new Error('Invalid webhook payload');
    }
    
    const processedEvents = [];
    
    for (const event of payload.events) {
      if (!event.name) continue;
      
      // Create event object with all data from payload
      const eventData = {
        ...event,
        clientId: payload.clientId,
        officeId: payload.officeId,
        userId: payload.userId,
        timestamp: new Date()
      };
      
      // Emit the specific event
      this.emit(event.name, eventData);
      
      // Also emit a generic 'all' event
      this.emit('all', eventData);
      
      processedEvents.push(eventData);
    }
    
    return processedEvents;
  }

  /**
   * Create an Express middleware handler
   * @returns {Function} Express middleware
   */
  createExpressMiddleware() {
    return (req, res, next) => {
      try {
        this.process(req.body);
        res.status(200).send('OK');
      } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(400).send('Invalid webhook payload');
      }
    };
  }

  /**
   * Get a list of supported event types
   * @returns {Array<string>} List of event types
   */
  getSupportedEvents() {
    return [...this.eventTypes];
  }

  /**
   * Check if an event type is supported
   * @param {string} eventType - Event type to check
   * @returns {boolean} Whether the event type is supported
   */
  isEventSupported(eventType) {
    return this.eventTypes.includes(eventType);
  }
}

module.exports = Webhook;
