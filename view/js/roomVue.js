const websocketURL =
  "ws://" + window.location.host + window.location.pathname + "/ws";
// websocketをインスタンス化
const websocket = new WebSocket(websocketURL);

new Vue({
  // elの要素配下でindexVue.jsが有効になる. 今回はdiv id="app"を指定
  el: "#app",

  data: function () {
    return {
      currentURL: location.href, // URLを格納
      message: "", // 入力したメッセージを格納する
      messages: [], // 送受信したメッセージを格納する
    };
  },

  methods: {
    CopyURL() {
      // textBoxを作成. コンテンツに取得したURLをいれる
      // textBoxの内容を選択してコピーすることで
      // クリップボードにコピーしている
      const textBox = document.createElement("textarea");
      textBox.setAttribute("id", "target");
      textBox.setAttribute("type", "hidden");
      textBox.textContent = this.currentURL;
      document.body.appendChild(textBox);

      textBox.select();
      document.execCommand("copy");
      document.body.removeChild(textBox);
    },
    /**
     * テキストフィールドでエンターキーが押された時か送信ボタンが押された時に発生
     */
    // 投稿を送信
    sendMessage: function () {
      // 未入力だった場合は終了
      if (this.message == "") {
        return;
      }
      // メッセージを送信
      websocket.send(this.message);
      // メッセージの初期化
      this.message = "";
    },

    /**
     * リストにメッセージを追加する
     * @param {String} message - 追加するメッセージ
     * @param {String} owner - 発言者
     */
    pushMessage: function (message, owner) {
      console.log(`message = ${message}, owner = ${owner}`);
      // メッセージを追加
      this.messages.push({
        message: message,
        owner: owner,
      });
    },
  },

  mounted: function () {
    let self = this;
    // websocketでメッセージが来たら受け取る
    websocket.onmessage = function (event) {
      console.log("### websocket.onmessage()");

      // 戻り値チェック
      if (event && event.data) {
        // 受信したメッセージを表示する
        self.pushMessage(event.data);
      }
    };
  },
});
