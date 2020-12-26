const websocketURL =
  "ws://" + window.location.host + window.location.pathname + "/ws";
// websocketをインスタンス化
const websocket = new WebSocket(websocketURL);

// 振り返りと抱負の識別子
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
      const params = new URLSearchParams();
      params.append('UserName', "MyID")
      params.append('Anonymous', 0)
      params.append('Which', flag)
      
      if (flag == Aspiration){
        if (this.aspiration == ""){
            return;
        }
        params.append('Message', this.aspiration)
        // (メッセージ内容, 送信者, 抱負か振り返りか)の形式で送信
        asp = this.aspiration + "," + "MyID" + "," + Aspiration
        websocket.send(asp)
        
        // 自分のと送信して戻ってきたので2つ表示されたのでとりあえずコメントアウト中
        // this.pushMessage(this.aspiration, "MyID", Aspiration)

        // 送ったらフォームをクリア 
        this.aspiration = "";

        axios.post('/sendMessageAspiration', params)
        .then(response =>{
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                this.fetchAllMessageAspiration()
            }
        })
      
        // 以下同様
      }else if (flag == Lookback){
        if (this.lookback == ""){
            return;
        }
        params.append('Message', this.lookback)
        lkb = this.lookback + "," + "MyID" + "," + Lookback;
        websocket.send(lkb)
        // this.pushMessage(this.lookback, "MyID", Lookback)
        this.lookback = "";

        axios.post('/sendMessageLookback', params)
        .then(response =>{
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                this.fetchAllMessageLookback()
            }
        })
      }
    },

    /**
     * リストにメッセージを追加する
     * @param {String} message - 追加するメッセージ
     * @param {String} owner - 発言者
     * @param {String} flag - 振り返りか抱負か, 必要に応じてintにします
     */
    pushMessage: function (message, owner, flag) {
      console.log(`message = ${message}, owner = ${owner}, flag = ${flag}`);
      if(flag == Aspiration){
          // 履歴リストにpush
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
      console.log("### Successfully pushed")
    },
    
    fetchAllMessageAspiration(){
        axuis.get('/fetchallasp')
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                var resultAsp = response.data
                this.aspiration_his = resultAsp
            }
        })
    },

    fetchAllMessageLookback(){
        axuis.get('/fetchalllkb')
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                var resultLkb = response.data
                this.aspiration_his = resultLkb
            }
        })
    }
  },

  

  mounted: function () {
    
    // 履歴を取得
    
    
    let self = this;
    // websocketでメッセージが来たら受け取る
    websocket.onmessage = function (event) {
      console.log("### websocket.onmessage()");
      console.log(event.data)

      // 戻り値チェック
      if (event && event.data) {
        // 受信したメッセージを履歴に追加
        // ,でsplitしてpushMessageに渡せるように
        var receive = (event.data.split(','));
        self.pushMessage(receive[0], receive[1], receive[2]);
      }
    };
  },
});
