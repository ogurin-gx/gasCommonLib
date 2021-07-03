/**
 * form回答取得
 * @param {array}itemResponse - form項目リスト
 * @param {string}対象タイトル - 検索対象formタイトル
 * @return {string} 回答内容
 */
function getFormResponse(itemResponse,target) {

  for (var j = 0; j < itemResponse.length; j++){    

    var formData = itemResponse[j];
    var title = formData.getItem().getTitle();
    var response = formData.getResponse();

    if (title == target) {
      return response;
    }
  }
}

/**
 * formプルダウンリスト上書き
 * @param {string}spreadSheetId - スプレッドシートID
 * @param {string}sheetName - シート名
 * @param {string}itemTitle - アイテムタイトル行名
 * @param (string)formId - フォームID
 * @param {string}targetFormTitle - 上書き対象formタイトル
 * @return {void} 
 */
function overwriteFormPullDownList(spreadSheetId,sheetName,itemTitle,formId,targetFormTitle) {

  var targetItems = getItemsFromSpreadSheet(spreadSheetId,sheetName,itemTitle);
  var form = FormApp.openById(formId);

  // 質問項目がプルダウンのもののみ取得
  var formItems = form.getItems(FormApp.ItemType.LIST);

  formItems.forEach(function(formItem){

    if(formItem.getTitle()==targetFormTitle){
      var listItemQuestion = formItem.asListItem();
      var choices = [];

      targetItems.forEach(function(name){
        if(name != ""){
          choices.push(listItemQuestion.createChoice(name));
        }
      });
      // プルダウンの選択肢を上書きする
      listItemQuestion.setChoices(choices);
    }
  });
}
