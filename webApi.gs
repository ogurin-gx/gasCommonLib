const CONTENT_TYPE_APP_JSON = 'application/json';


/** 
 * Slack通知 
 * 
 * @param {string}webHookId - WEB HOOK ID
 * @param {string}channel - チャネル名
 * @param {string}text - 本文
 * @param {string}icon_emoji - アイコン絵文字
 * @return {string}content - 実行結果（OK）
 */
function notifySlack(webHookId,channel,username,text,icon_emoji) {

  var slackApi = new SlackApi(webHookId);
  slackApi.createPayload(channel,username,text,icon_emoji);
  return slackApi.post();
}

function createApiAccessArray(apiKey,apiSecret,userId) {
  return new Array(apiKey,apiSecret,userId);
}

/** 
 * Zoom会議生成 
 * 
 * @param {Array}apiAccessArray - [0]apiKey,[1]apiSecret,[2]userId
 * @param {string}topic - 件名
 * @param {int}type - タイプ
 * @param {datetime}}startTime - 開始時間
 * @param {int}duration - 所要時間
 * @param {string}timezone - タイムゾーン
 * @param {boolean}host_video - ホストビデオON/OFF
 * @param {boolean}participant_video - 参加者ビデオON/OFF
 * @param {boolean}join_before_host - ホスト開始前の参加ON/OFF
 * @param {boolean}sets_waiting_room - 待合室ON/OFF
 * @return {array} contentText -　実行結果（JSON）
 */
function createZoomMeeting(apiAccessArray,
                          topic,type,startTime,duration,timezone,
                          host_video,participant_video,join_before_host,sets_waiting_room,) {

  var zoomApi = new ZoomApi(apiAccessArray[0],apiAccessArray[1],apiAccessArray[2]);
  zoomApi.createPayload(topic,type,startTime,duration,timezone,host_video,participant_video,join_before_host);
  return zoomApi.post();
}

/*
* -------------------------*
* WebApi基底クラス
* -------------------------*
*/
class WebApiBase {

  /*
  * -------------------------*
  * コンストラクタ
  *
  * @param なし
  * -------------------------*
  */
  constructor() {
    this.url = null;
    this.payload = null;
    this.headers = null;
    this.contentType = null;
  }

  /*
  * -------------------------*
  * ポストメソッド
  *
  * @param なし
  * @return responseのcontentText
  * -------------------------*
  */
  post(){

    var response = UrlFetchApp.fetch(this.url, this.createtOptions('POST'));
    var contentText = response.getContentText('UTF-8');
    var content = null;

    try {
      var content = JSON.parse(contentText);
    } catch(e) {
      console.log('JSONパースに失敗しました')
      console.log('contentText:' + contentText);
      content = contentText;
    }
    return content;
  }

  /*
  * -------------------------*
  * options生成
  *
  * @param メソッド（POST/GET)
  * @return 生成したoptions
  * -------------------------*
  */
  createtOptions(method) {

    var options = {};

    // optionsの生成
    options['method'] = method;
    options['contentType'] = this.contentType;

    // JSONの場合
    if (this.contentType == CONTENT_TYPE_APP_JSON) {
      options['payload'] = JSON.stringify(this.payload);
    }

    // headersありの場合
    if (this.headers != null) {
      options['headers'] = this.headers;
    }
    console.log("options:");
    console.log(options);
    return options;
  }

  /*
  * -------------------------*
  * データ生成（呼び出し側で連想配列生成する場合）
  *
  * @param payload(連想配列で生成)
  * @return void
  * -------------------------*
  */    
  createPayloadByArray(payloadArray) {
    this.payload = payloadArray;
  }
}

class SlackApi extends WebApiBase{

  /*
  * -------------------------*
  * コンストラクタ
  *
  * @param SLACKのWEBHOIK ID
  * -------------------------*
  */
  constructor(webhookId) {
    super(WebApiBase);

    this.url = "https://hooks.slack.com/services/" + webhookId;
    this.contentType = CONTENT_TYPE_APP_JSON;

    this.channel = '';
    this.username = '';
    this.text = '';
    this.icon_emoji = '';
  }

  /*
  * -------------------------*
  * payload生成（引数固定）
  *
  * @param channel チャンネル名
  * @param username 表示ユーザー名
  * @param text 本文
  * @param icon_emoji アイコン表示用絵文字
  * @return void
  * -------------------------*
  */
  createPayload(channel, username, text, icon_emoji) {

    super.payload = { 
      "channel" : channel, 
      "username" : username, 
      "text" : text, 
      "icon_emoji" : icon_emoji 
      };
      console.log(super.payload);
  }

  /*
  * -------------------------*
  * payload生成（BEAN指定）
  *
  * @param slackPayload slack用payloadのbeanクラス
  * @return void
  * -------------------------*
  */
  createPayloadByBean(slackPayload) {

      var payload = {};
      if(slackPayload.channel != null) payload["channel"] = slackPayload.channel;
      if(slackPayload.username != null) payload["username"] = slackPayload.username;
      if(slackPayload.text != null) payload["text"] = slackPayload.text;
      if(slackPayload.icon_emoji != null) payload["icon_emoji"] = slackPayload.icon_emoji;

      super.payload = payload;
  }
}

/*
* -------------------------*
* ZoomAPIクラス(JWTアクセス用)
* -------------------------*
*/
class ZoomApi extends WebApiBase {

  /*
  * -------------------------*
  * コンストラクタ
  *
  * @param apiKey zoom APIキー
  * @param apiSecret zoom APIシークレット
  * @param userId zoom ユーザーID
  * -------------------------*
  */
  constructor(apiKey,apiSecret,userId){
    super(WebApiBase);

    // コンテンツタイプ（JSON形式）
    this.contentType = CONTENT_TYPE_APP_JSON;

    // トークン取得
    var token = this.getToken(apiKey,apiSecret);

    // headersにトークンを設定
    this.headers = {'Authorization' : 'Bearer ' + token};

    // zoomミーティング作成用URL
    super.url = 'https://api.zoom.us/v2/users/' + userId + '/meetings';
  }

  /*
  * -------------------------*
  * トークン取得
  *
  * @param apiKey zoom APIキー
  * @param apiSecret zoom APIシークレット
  * @return 生成したトークン
  * -------------------------*
  */
  getToken(apiKey, apiSecret) {

    const header = Utilities.base64Encode(JSON.stringify({
      'alg':'HS256',
      'typ':'JWT'
    }));

    const claimSet = JSON.stringify({
      "iss": apiKey,
      "exp": Date.now() + 3600
    });
    
    const encodeText = header + "." + Utilities.base64Encode(claimSet);
    const signature = Utilities.computeHmacSha256Signature(encodeText, apiSecret);
    const jwtToken = encodeText + "." + Utilities.base64Encode(signature);

    return jwtToken;
  }

  /**
  * payload生成（引数固定）
  * @param {string} topic - 会議名
  * @param {int} type - タイプ
  * @param {datetime} startTime - 開始時間
  * @param duration 所要時間
  * @param timezone タイムゾーン
  * @param host_video ホストビデ表示ON/OFF
  * @param participant_video 参加者ビデオ表示ON/OFF
  * @param join_before_host ホストより先に参加できるかON/OFF
  * @param waiting_room 待合室有無ON/OFF
  * @return void
   */
  createPayload(topic, type, startTime, duration,timezone,host_video,participant_video,join_before_host,waiting_room) {

    super.payload = {
      'topic': topic,　// トピック
      'type': type, // 
      'start_time': startTime, // 開始日時
      'duration': duration, // 時間
      'timezone': timezone, // タイムゾーン
      'settings':{
        'host_video':host_video, // ホストビデオ(boolean)
        'participant_video': participant_video,　// 参加者ビデオ(boolean)
        'join_before_host': join_before_host, // ホストより前に参加者がミーティングに参加(boolean)
        'waiting_room':waiting_room // 待機室(boolean)
      }
    }  
  }
    /*
  * -------------------------*
  * payload生成（BEAN指定）
  *
  * @param zoomPayload zoom用payloadのbeanクラス
  * @return void
  * -------------------------*
  */
  createPayloadByBean(zoomPayload) {

    var payload = {};
    if(zoomPayload.topic != null) payload["topic"] = zoomPayload.topic;
    if(zoomPayload.type != null) payload["type"] = zoomPayload.type;
    if(zoomPayload.start_time != null) payload["text"] = zoomPayload.start_time;
    if(zoomPayload.duration != null) payload["icon_emoji"] = zoomPayload.duration;
    if(zoomPayload.timezone != null) payload["timezone"] = zoomPayload.timezone;

    var settings = {};
    if(zoomPayload.sets_host_video != null) settings["host_video"] = zoomPayload.sets_host_video;
    if(zoomPayload.sets_participant_video != null) settings["participant_video"] = zoomPayload.sets_participant_video;
    if(zoomPayload.sets_join_before_host != null) settings["join_before_host"] = zoomPayload.sets_join_before_host;
    if(zoomPayload.sets_waiting_room != null) settings["sets_waiting_room"] = zoomPayload.sets_waiting_room;
    if(zoomPayload.sets_breakout_room != null) settings["breakout_room"] = zoomPayload.sets_breakout_room;
    payload["settings"] = settings;

    super.payload = payload;
  }
}
