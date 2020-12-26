const websocketURL =
  "ws://" + window.location.host + window.location.pathname + "/ws";
// websocketをインスタンス化
const websocket = new WebSocket(websocketURL);

const Aspiration = 0;
const Lookback   = 1;

new Vue({
  // elの要素配下でroomVue.jsが有効になる. 今回はdiv id="app"を指定
  el: "#app",

  data: function () {
    return {
      currentURL: location.href, // URLを格納

      aspiration: "",
      aspiration_his: [], // 送受信した抱負の履歴

      lookback: "",
      lookback_his: [],   // 送受信した反省の履歴
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
    sendMessage: function (flag) {
      if (flag == Aspiration){
        if (this.aspiration == ""){
            return;
        }
        websocket.send(this.aspiration, Aspiration)
        this.pushMessage(this.aspiration, "MyID", Aspiration)
        this.aspiration = "";
      }else if (flag == Lookback){
        if (this.lookback == ""){
            return;
        }
        websocket.send(this.lookback, Lookback)
        this.pushMessage(this.lookback, "MyID", Lookback)
        this.lookback = "";
      }
    },

    /**
     * リストにメッセージを追加する
     * @param {String} message - 追加するメッセージ
     * @param {String} owner - 発言者
     */
    pushMessage: function (message, owner, flag) {
      console.log(`message = ${message}, owner = ${owner}, flag = ${flag}`);
      if(flag == Aspiration){
          this.aspiration_his.push({
              aspiration: message,
              owner: owner,
              flag: flag,
          })
      }else if (flag == Lookback){
          this.lookback_his.push({
              lookback: message,
              owner: owner,
              flag: flag
          })
      }
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
