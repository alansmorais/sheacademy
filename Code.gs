const PRIMARY_EMAIL = "contact@sheacademy.no";
const CC_EMAIL = "contact@sheacademy.no";
const SEND_FROM_EMAIL = "alanpkmorais@gmail.com";

// Helper function to get or create a sheet and set up headers
function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Handles retrieving the feedback for anyone to see on the website
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Feedback");
    let reviews = [];
    
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      // Loop backwards to show the newest reviews first (skip the header row)
      for(let i = data.length - 1; i >= 1; i--) {
        // Only push if rating and comments exist
        if(data[i][2] && data[i][3]) {
           reviews.push({
              rating: data[i][2],
              text: data[i][3],
              date: new Date(data[i][0]).toLocaleDateString()
           });
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify(reviews))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles saving Bookings, Contacts, and Feedback
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type; 
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (type === "feedback") {
      // Save feedback to the spreadsheet
      const headers = ["Timestamp", "Registered Phone", "Rating", "Comments"];
      const sheet = getOrCreateSheet(ss, "Feedback", headers);
      sheet.appendRow([new Date(), data.phone, data.rating, data.comments]);
      
    } else if (type === "contact") {
      const headers = ["Timestamp", "Name", "Email", "Message"];
      const sheet = getOrCreateSheet(ss, "Contact", headers);
      sheet.appendRow([new Date(), data.name, data.email, data.message]);
      
      const subject = `SHE. Website Inquiry from ${data.name}`;
      const body = `You have received a new contact message from the SHE. academy website.\n\n` +
                   `Name: ${data.name}\nEmail: ${data.email}\nMessage:\n${data.message}\n\n` +
                   `---\nTimestamp: ${new Date().toLocaleString()}`;
                   
      GmailApp.sendEmail(PRIMARY_EMAIL, subject, body, {
        replyTo: data.email, from: SEND_FROM_EMAIL, name: "SHE. Academy Website"
      });
      
    } else if (type === "booking") {
      // CONCURRENCY LOCK: Prevent double-bookings by serializing requests
      const lock = LockService.getScriptLock();
      try {
        // Wait up to 10 seconds for a lock
        if (!lock.tryLock(10000)) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "System busy. Please try again in a moment." 
          })).setMimeType(ContentService.MimeType.JSON);
        }

        const headers = ["Timestamp", "Booking ID", "Client Name", "Email", "Phone", "Service", "Practitioner", "Requested Date", "Requested Time", "Payment Status", "Notes"];
        const sheet = getOrCreateSheet(ss, "Bookings", headers);
        sheet.appendRow([
          new Date(), data.bookingId, data.first + " " + data.last, data.email, data.phone, 
          data.service, data.practitioner, data.date, data.time, "Pending", data.notes
        ]);
        
        const recipient = data.practitionerEmail || PRIMARY_EMAIL;
        const subject = `SHE. New Booking Request (PENDING PAYMENT): ${data.first} ${data.last}`;
        const body = `You have a new booking request from the SHE. academy website.\n\n` +
                     `STATUS: PENDING PAYMENT (Redirected to Stripe)\n\n` +
                     `Booking ID: ${data.bookingId}\n` +
                     `Client: ${data.first} ${data.last}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n` +
                     `Service: ${data.service}\nPractitioner: ${data.practitioner}\n` +
                     `Requested Date: ${data.date}\nRequested Time: ${data.time}\n\n` +
                     `Notes/Message:\n${data.notes ? data.notes : "None provided."}\n\n` +
                     `---\nTimestamp: ${new Date().toLocaleString()}`;
                     
        GmailApp.sendEmail(recipient, subject, body, {
          cc: CC_EMAIL, replyTo: data.email, from: SEND_FROM_EMAIL, name: "SHE. Academy Website"
        });

      } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: e.toString() }))
          .setMimeType(ContentService.MimeType.JSON);
      } finally {
        lock.releaseLock();
      }
    } else if (type === "confirmPayment") {
      const lock = LockService.getScriptLock();
      try {
        if (!lock.tryLock(10000)) {
          return ContentService.createTextOutput(JSON.stringify({ success: false, error: "System busy" })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName("Bookings");
        if (!sheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Sheet not found" })).setMimeType(ContentService.MimeType.JSON);
        
        const dataRows = sheet.getDataRange().getValues();
        const bookingId = data.bookingId;
        let found = false;
        
        for (let i = 1; i < dataRows.length; i++) {
          if (dataRows[i][1] === bookingId) {
            sheet.getRange(i + 1, 10).setValue("Paid"); // Column J is Payment Status
            found = true;
            
            // Send confirmation email to practitioner and admin
            const clientName = dataRows[i][2];
            const service = dataRows[i][4];
            const practitioner = dataRows[i][5];
            const date = dataRows[i][6];
            const time = dataRows[i][7];
            
            const subject = `SHE. PAYMENT CONFIRMED: ${clientName} - ${service}`;
            const body = `Great news! Payment has been confirmed for the following booking:\n\n` +
                         `Booking ID: ${bookingId}\n` +
                         `Client: ${clientName}\n` +
                         `Service: ${service}\n` +
                         `Practitioner: ${practitioner}\n` +
                         `Date: ${date}\n` +
                         `Time: ${time}\n\n` +
                         `The appointment is now officially confirmed in the system.`;
            
            GmailApp.sendEmail(PRIMARY_EMAIL, subject, body, {
              cc: CC_EMAIL, from: SEND_FROM_EMAIL, name: "SHE. Academy Website"
            });
            
            break;
          }
        }
        
        return ContentService.createTextOutput(JSON.stringify({ success: found }))
          .setMimeType(ContentService.MimeType.JSON);
      } finally {
        lock.releaseLock();
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
