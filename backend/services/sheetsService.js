const fetch = require('node-fetch');

const sendToSheets = async (data) => {
  const url = process.env.SHEETS_URL;
  if (!url || url.includes('YOUR_APPS_SCRIPT_ID')) {
    console.warn('SHEETS_URL not configured, skipping.');
    return false;
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('Sent to Google Sheets');
    return true;
  } catch (err) {
    console.warn('Sheets send failed (non-fatal):', err.message);
    return false;
  }
};

module.exports = { sendToSheets };