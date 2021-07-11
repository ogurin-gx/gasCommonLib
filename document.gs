/**
 * ドキュメントコメント取得
 * @param {string}document_id - ドキュメントID
 * @return コメントリスト
 */
function getComments(document_id) {

  var document = new Document(document_id);
  return document.getComments();
}

class Document {

  constructor(document_id) {
    this.document = DocumentApp.openById(document_id);
  }

  getComments() {

    return Drive.Comments.list(this.document.getId(), {'maxResults':100}); 
  }
}
