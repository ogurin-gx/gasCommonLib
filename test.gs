/*

// zoomアクセス
this.ZM_API_KEY = ScriptProperties.getProperty("ZM_API_KEY");
this.ZM_API_SECRET = ScriptProperties.getProperty("ZM_API_SECRET");
this.ZM_USER_ID = ScriptProperties.getProperty("ZM_USER_ID");

// slackアクセス
this.SLK_WEBHOOK_ID = ScriptProperties.getProperty("SLK_WEBHOOK_ID");

function testZoom() {

  const zoom = new ZoomApi(ZM_API_KEY,ZM_API_SECRET,ZM_USER_ID);

  zoom.createPayload('リーダー会',)
  zoom.createPayload('リーダー会',2,'2021-07-03T11:00:00',60,'Asia/Tokyo', true,true,true,true);
  var content = zoom.post();

  console.log(content);

}

function testZoomByBean() {

  const zoom = new ZoomApi(ZM_API_KEY,ZM_API_SECRET,ZM_USER_ID);

  var zoomPayload = new ZoomPayload();

  zoomPayload.topic = "帰社日委員";
  zoomPayload.type = 2;
  zoomPayload.startTime = '2021/07/03T14:00:00';
  zoomPayload.duration = 60;
  zoomPayload.timezone = 'Asia/Tokyo';
  zoomPayload.sets_host_video = true;
  zoomPayload.sets_participant_video = true;
  zoomPayload.sets_join_before_host = false;
  zoomPayload.sets_waiting_room = true;
  // zoomPayload.sets_breakout_room = false;

  zoom.createPayloadByBean(zoomPayload);
  var content = zoom.post();

  console.log(content);

}

function testSlack() {

  const slack = new SlackApi(SLK_WEBHOOK_ID);
  slack.createPayload('@r.oguro','テスト','テストです',':bell:');
  var content = slack.post();

  console.log(content);
}

function testSlackByArray() {

  const slack = new SlackApi(SLK_WEBHOOK_ID);

  var payload = {
      "channel" : '@r.oguro', 
      "username" : 'テスト', 
      "text" : 'テストです', 
      "icon_emoji" : ':bell:' 
  }
  slack.createPayloadByArray(payload);
  var content = slack.post();

  console.log(content);
}

function testSlackByBean() {

  const slack = new SlackApi(SLK_WEBHOOK_ID);

  var slackPayload = new SlackPayload();

  slackPayload.channel = '@r.oguro';
  slackPayload.username = 'テスト';
  slackPayload.text = 'テストです';
  slackPayload.icon_emoji = ':bell:';

  console.log(slackPayload);

  slack.createPayloadByBean(slackPayload);
  var content = slack.post();

  console.log(content);

}

function testGetItems() {

  const SS_ID = ScriptProperties.getProperty("SS_ID");

  var items = getItemsFromSpreadSheet(SS_ID,"データ","slackユーザ");
  console.log(items);
}


// プロパティ設定用
function setProperty(){

  ScriptProperties.setProperty("ZM_API_KEY","***********");
  ScriptProperties.setProperty("ZM_API_SECRET","***********");
  ScriptProperties.setProperty("ZM_USER_ID","***********");

  ScriptProperties.setProperty("SLK_WEBHOOK_ID","*******");
  ScriptProperties.setProperty("SS_ID","**********");
}
*/