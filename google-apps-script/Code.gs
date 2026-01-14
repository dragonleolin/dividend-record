function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    
    // Parse Date: YYYY-MM-DD
    const dateStr = data.date; 
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString();
    
    // Open Spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(year);
    
    // Create Sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet(year);
      // Header: ['月份', '日期', '標的名稱', '金額', '股數/單位數', '月小計', '備註']
      sheet.appendRow(['月份', '日期', '標的名稱', '金額', '股數/單位數', '月小計', '備註']);
    }

    // Append Row
    // [month, dateString, ticker, amount, shares, '', notes]
    sheet.appendRow([
      month,
      dateStr,
      data.ticker,
      data.amount,
      data.shares,
      '', // 月小計 usually formula or empty
      data.note
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Use current year or specific year if param provided, default to current
    const dateObj = new Date();
    const year = dateObj.getFullYear().toString();
    const sheet = ss.getSheetByName(year);
    
    let history = [];
    
    if (sheet) {
      const lastRow = sheet.getLastRow();
      // Assume header is row 1, data starts row 2.
      // Get last 5 rows, or all if less than 5
      const numRows = Math.max(0, lastRow - 1);
      
      if (numRows > 0) {
        const startRow = Math.max(2, lastRow - 4); // Get last 5
        const dataRange = sheet.getRange(startRow, 1, (lastRow - startRow + 1), 7);
        const values = dataRange.getValues();
        
        // Reverse to show newest first
        history = values.reverse().map(row => ({
          month: row[0],
          date: row[1], // Date object or string depending on formatting
          ticker: row[2],
          amount: row[3],
          shares: row[4],
          note: row[6]
        }));
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', history: history }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
