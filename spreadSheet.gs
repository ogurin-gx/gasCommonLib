/**
 * アイテムリスト取得（スプレッドシート）
 * @param {string}spreadSheetId - スプレッドシートID
 * @param {string}sheetName - シート名
 * @param {string}itemTitle - アイテムタイトル行名
 * @return {array} アイテムリスト
 */
function getItemsFromSpreadSheet(spreadSheetId,sheetName,itemTitle) {

  var spreadSheet = new Spreadsheet(spreadSheetId,sheetName);
  return spreadSheet.getItems(itemTitle);
}

class Spreadsheet {

  constructor(spreadSheetId,sheetName) {
    this.sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName);
  }
  getItems(itemTitle) {

    const rows        = this.sheet.getDataRange();
    const values      = rows.getValues();
    const headerRow   = values[0];

    const itemColIdx  = headerRow.indexOf(itemTitle);

    var items = new Array();
    for(let i = 1; i < values.length; i++){
      items.push(values[i][itemColIdx]);
    }
    return items;
  }
}
