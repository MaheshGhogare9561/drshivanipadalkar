/**
 * Dr. Shivani Padalkar - Google Sheet setup for the enquiry form
 * ===============================================================
 *
 * ONE-TIME SETUP (about 10 minutes)
 * ---------------------------------
 *  1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *     Name it: "Dr Shivani - Website Enquiries".
 *     Use the clinic's Google account, not a personal one.
 *
 *  2. In the sheet: Extensions > Apps Script.
 *
 *  3. Delete the sample code in Code.gs. Paste in ALL of apps-script.js.
 *     Then click "+" > Script, name it "Setup", and paste in THIS file.
 *     Click Save (disk icon).
 *
 *  4. (Optional) In apps-script.js, set NOTIFY_EMAIL to the address that
 *     should get an alert for each new enquiry.
 *
 *  5. Run the setup once:
 *     Choose the function "setupSheet" in the toolbar dropdown, then click Run.
 *     Google asks for permission. Click Review permissions, choose the clinic
 *     account, then Advanced > Go to (project name) > Allow.
 *     This creates the "Enquiries" tab with headers and formatting.
 *
 *  6. Deploy as a web app:
 *     Deploy > New deployment > gear icon > Web app
 *       Description:      Website enquiry form
 *       Execute as:       Me
 *       Who has access:   Anyone
 *     Click Deploy and copy the "Web app URL"
 *     (looks like https://script.google.com/macros/s/AKfy..../exec).
 *
 *  7. Paste that URL into BOTH:
 *       - index.html        find:  var SCRIPT_URL = '';
 *       - branch-test.html  in the "Web app URL" box at the top of the page
 *
 *  8. Open branch-test.html in your browser and send a test enquiry.
 *     A new row should appear in the sheet within a few seconds.
 *     Delete the test row afterwards.
 *
 *  9. Upload index.html to Hostinger (right-click > Upload File in VS Code).
 *
 * IF YOU CHANGE apps-script.js LATER
 * ----------------------------------
 *  Deploy > Manage deployments > pencil icon > Version: "New version" > Deploy.
 *  The URL stays the same, so the website does not need changing.
 *
 * PRIVACY (health data)
 * ---------------------
 *  - Share the sheet only with staff who handle appointments.
 *  - Turn on 2-step verification for the Google account.
 *  - Delete enquiries that didn't lead to a consultation, following the
 *    retention period written in privacy-policy.html (section 9).
 */

/** Run once from the Apps Script editor. Creates and formats the Enquiries sheet. */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  sheet.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight('bold')
    .setBackground('#73334d')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  var widths = [160, 180, 140, 170, 380, 80, 220, 110];
  widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  sheet.getRange('A:A').setNumberFormat('dd-mmm-yyyy hh:mm');
  sheet.getRange('E:E').setWrap(true);

  // Status dropdown so staff can track follow-up
  var statusCol = HEADERS.indexOf('Status') + 1;
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Called', 'Booked', 'Not interested', 'No answer'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusCol, sheet.getMaxRows() - 1, 1).setDataValidation(rule);

  // Remove the default empty "Sheet1" if it's still there
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);

  SpreadsheetApp.getUi().alert('Setup complete. Now deploy as a web app (step 6).');
}

/** Optional: run from the editor to add a test row without using the website. */
function testInsert() {
  var result = doPost({ parameter: {
    name: 'Test Patient', phone: '9999999999', topic: 'Skin concern',
    message: 'Test from Apps Script editor', consent: 'yes', page: 'editor-test'
  }});
  Logger.log(result.getContent());
}
