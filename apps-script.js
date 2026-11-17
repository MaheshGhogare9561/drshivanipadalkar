/**
 * Dr. Shivani Padalkar - Enquiry form handler (Google Apps Script)
 * -----------------------------------------------------------------
 * This code runs on Google's servers, NOT on the website.
 * Paste it into the Apps Script editor of your Google Sheet
 * (Extensions > Apps Script). Full steps: google-apps-script-setup.js
 *
 * What it does:
 *   1. Receives the enquiry form from index.html (POST)
 *   2. Checks the required fields and blocks simple spam bots
 *   3. Adds one row to the "Enquiries" sheet
 *   4. Optionally emails a short alert (no medical details in the email)
 */

// ===== SETTINGS =====
var SHEET_NAME   = 'Enquiries';
var NOTIFY_EMAIL = '';            // e.g. 'appointments@drshivanipadalkar.in'  (leave '' for no email)
var SITE_NAME    = 'Dr. Shivani Padalkar website';

// Column order in the sheet. Keep in sync with setupSheet() in google-apps-script-setup.js
var HEADERS = ['Timestamp', 'Name', 'Phone', 'Topic', 'Message', 'Consent', 'Page', 'Status'];

/** Handles the form submission from the website. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: real visitors never see or fill the "website" field
    if (p.website) return json_({ ok: true });

    var name    = clean_(p.name, 100);
    var phone   = String(p.phone || '').trim().slice(0, 20);  // validated below, stored as text
    var topic   = clean_(p.topic, 60);
    var message = clean_(p.message, 1000);
    var consent = p.consent === 'yes' ? 'Yes' : 'No';
    var page    = clean_(p.page, 200);

    if (!name || !/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      return json_({ ok: false, error: 'Please enter your name and a valid phone number.' });
    }
    if (consent !== 'Yes') {
      return json_({ ok: false, error: 'Consent is required.' });
    }

    var sheet = getSheet_();
    // Leading ' keeps the phone as text, so "+91..." or a leading 0 isn't changed by Sheets
    sheet.appendRow([new Date(), name, "'" + phone, topic, message, consent, page, 'New']);

    if (NOTIFY_EMAIL) {
      // Keep health details out of email; staff read the full message in the sheet.
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New enquiry - ' + SITE_NAME,
        body: 'A new appointment enquiry was received.\n\n' +
              'Name: '  + name  + '\n' +
              'Phone: ' + phone + '\n' +
              'Topic: ' + topic + '\n\n' +
              'Open the Google Sheet to see the full enquiry.'
      });
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Server error. Please call us instead.' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/** Opening the web-app URL in a browser shows this, which is a quick "is it live?" check. */
function doGet() {
  return json_({ ok: true, service: SITE_NAME + ' enquiry form', time: new Date().toISOString() });
}

// ===== HELPERS =====
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Trims, limits length, and stops spreadsheet formula injection (=, +, -, @). */
function clean_(value, maxLen) {
  var s = String(value || '').trim().slice(0, maxLen);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
