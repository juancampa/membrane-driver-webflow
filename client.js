const { API_TOKEN } = process.env;
if (!API_TOKEN) {
  throw new Error('Please provide API_TOKEN as environment variable');
}

import Webflow from 'webflow-api';

export const webflow = new Webflow({ token: 'API_TOKEN' });
