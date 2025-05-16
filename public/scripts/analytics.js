/**
 * Simple analytics tracking script for Kottab
 */
(function() {
  // Only run in production to avoid tracking during development
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    console.log('Analytics: Development environment detected, not tracking');
    return;
  }
  
  // Simple page view tracking
  function trackPageView() {
    const pageData = {
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, you would send this data to your analytics endpoint
    console.log('Analytics: Page view tracked', pageData);
    
    // Example of how you might send this data to a real endpoint
    // fetch('/api/analytics/pageview', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(pageData),
    // }).catch(err => console.error('Analytics error:', err));
  }
  
  // Track initial page view
  trackPageView();
  
  // Track navigation events for SPAs
  if (typeof history !== 'undefined') {
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(trackPageView, 300); // Small delay to ensure DOM is updated
    };
    
    window.addEventListener('popstate', () => {
      setTimeout(trackPageView, 300);
    });
  }
})();
