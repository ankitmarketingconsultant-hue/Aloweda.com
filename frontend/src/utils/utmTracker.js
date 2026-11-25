/**
 * UTM Tracker Utility
 * Captures UTM params from URL and stores in localStorage
 * so they can be sent on signup even if user navigates away first
 */

export const captureUTM = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utmSource:   params.get('utm_source')   || '',
      utmMedium:   params.get('utm_medium')   || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent:  params.get('utm_content')  || '',
      utmTerm:     params.get('utm_term')     || '',
      referrer:    document.referrer          || '',
      landingPage: window.location.pathname   || '',
    };

    // Only save if we have at least one UTM param or a referrer
    if (utm.utmSource || utm.utmMedium || utm.referrer) {
      localStorage.setItem('aloweda_utm', JSON.stringify(utm));
    } else {
      // If no UTM but also nothing saved yet, save as Direct
      if (!localStorage.getItem('aloweda_utm')) {
        localStorage.setItem('aloweda_utm', JSON.stringify({
          ...utm,
          utmSource: 'direct',
        }));
      }
    }
  } catch (e) {
    // Silent fail — tracking should never break the app
  }
};

export const getUTM = () => {
  try {
    const stored = localStorage.getItem('aloweda_utm');
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const clearUTM = () => {
  try {
    localStorage.removeItem('aloweda_utm');
  } catch (e) {}
};
