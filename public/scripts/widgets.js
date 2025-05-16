/**
 * Widget initialization script for Kottab
 * This script handles loading and initializing third-party widgets
 * and interactive elements that are not critical for initial page render
 */
(function() {
  // Only initialize in production to avoid unnecessary loads during development
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    console.log('Widgets: Development environment detected, not initializing widgets');
    return;
  }
  
  // Helper function to safely initialize widgets
  function initializeWidget(widgetId, initFunction) {
    try {
      const widgetElement = document.getElementById(widgetId);
      if (widgetElement) {
        initFunction(widgetElement);
      }
    } catch (error) {
      console.error(`Error initializing widget ${widgetId}:`, error);
    }
  }
  
  // Initialize widgets when DOM is fully loaded
  window.addEventListener('DOMContentLoaded', function() {
    // Feedback widget initialization example
    initializeWidget('feedback-widget', function(element) {
      element.classList.add('widget-loaded');
      console.log('Feedback widget initialized');
    });
    
    // Chat widget initialization example
    initializeWidget('chat-support', function(element) {
      element.classList.add('widget-loaded');
      console.log('Chat support widget initialized');
    });
    
    // Initialize other widgets as needed
  });
})();
