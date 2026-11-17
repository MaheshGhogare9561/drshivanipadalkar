DR. SHIVANI PADALKAR - WEBSITE
Live site: https://drshivanipadalkar.in
==========================================================

FOLDER STRUCTURE
----------------
Dr.shivani padalkar/
|-- index.html                    Homepage (all CSS + JS inside)            -> upload to Hostinger
|-- privacy-policy.html           Privacy policy page (all CSS + JS inside) -> upload to Hostinger
|-- apps-script.js                Enquiry form handler. Runs on Google, NOT uploaded
|-- google-apps-script-setup.js   Step-by-step Google Sheet setup + setupSheet() helper
|-- branch-test.html              Local test page for the enquiry form, NOT uploaded
|-- README.txt                    This file, NOT uploaded
|-- .gitignore                    Keeps sftp.json out of GitHub
|-- .vscode/
|   `-- sftp.json                 Hostinger SFTP login. Local only, never on GitHub

Only index.html and privacy-policy.html go to the server. Everything else
is listed in the "ignore" section of .vscode/sftp.json, so the SFTP
extension skips it.


HOW THE ENQUIRY FORM WORKS
--------------------------
Visitor fills the form on index.html
   -> sent to the Google Apps Script web app (apps-script.js)
   -> saved as a new row in the "Enquiries" Google Sheet
   -> (optional) short email alert to NOTIFY_EMAIL

First-time setup: follow the steps at the top of google-apps-script-setup.js.
Then paste the web app URL into index.html here:
    var SCRIPT_URL='';
Until that is filled in, the form tells visitors to call instead.

Test it with branch-test.html (open it straight from this folder in a browser).


UPLOADING TO HOSTINGER
----------------------
VS Code with the "SFTP" extension:
  Right-click index.html          > Upload File
  Right-click privacy-policy.html > Upload File
Files go to: public_html on drshivanipadalkar.in
uploadOnSave is off, so nothing uploads by accident.


BEFORE GOING LIVE - CHECKLIST
-----------------------------
[ ] Fill every [ADD ...] placeholder in index.html and privacy-policy.html
    (registration number, address, phone, email, dates, retention periods)
[ ] Doctor confirms the qualification names and the services/conditions listed
[ ] Lawyer reviews privacy-policy.html
[ ] Upload the doctor's photo to this site and update the <img> src in index.html
    (it currently loads from rebornclinics.in)
[ ] Google Sheet set up, SCRIPT_URL pasted, test enquiry received
[ ] Change the Hostinger SFTP password if it has been shared anywhere


EDITING TIPS
------------
- Colours are set once at the top of each page's <style>:
    --sp-wine (main colour), --sp-rose, --sp-ivory, --sp-ink, --sp-muted
- The header and footer are copied in both pages. If you change a menu link,
  change it in both index.html and privacy-policy.html.
- All styles are scoped under #shivani-site, so the same code also works
  pasted into an Elementor HTML widget (copy from <div id="shivani-site">
  to its closing </div>).
