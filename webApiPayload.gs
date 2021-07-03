class SlackPayload {

  constructor() {
    this.channel = null;
    this.username = null;
    this.text = null;
    this.icon_emoji = null;
  }
}

class ZoomPayload {

  constructor() {
    this.topic = null;　// トピック
    this.type = null; // タイプ
    this.startTime = null; // 開始日時
    this.duration = null; // 時間
    this.timezone = null;; // タイムゾーン
    // 以下settings配下
    this.sets_host_video = null; // ホストビデオ(boolean)
    this.sets_participant_video = null;　// 参加者ビデオ(boolean)
    this.sets_join_before_host = null; // ホストより前に参加者がミーティングに参加(boolean)
    this.sets_waiting_room = null; // 待機室(boolean) 
    this.sets_breakout_room = null; // ブレイクアウトルーム(boolean)
  }
}