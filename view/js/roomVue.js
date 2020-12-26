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

      userNameAsp: "匿名", //ユーザ名
      userNameLkb: "匿名",

      anonymousflag: 0,  // 匿名表示するかどうか

      userID: "",        // ユーザ固有のID

      delfalg: 0,    // 削除モードかどうか
                         // 自分の投稿のみ表示している状態を削除モードとすれば楽そう

      mesid: []     // メッセージID, 削除に必要なのでDBから取得
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
     * 以降の機能全般は, axiosにURLをパスして, 
     * そのURLに基づいてルータがルーティングしてコントローラを動かす. 
     * /
     
    /**
     * テキストフィールドでエンターキーが押された時か送信ボタンが押された時に発生
     */
    // 投稿を送信
    sendMessage: function (flag) {
      //axiosに渡すパスの整形
      const params = new URLSearchParams();
      params.append('Anonymous', this.anonymousflag)
      params.append('Roomname', location.pathname.replace('/room/', ''))
      params.append('Userid', this.userID)
      
      // 抱負ならwhichに0を入れて抱負用関数をトリガー
      if (flag == Aspiration){
        if (this.aspiration == ""){
            return;
        }
        params.append('UserName', this.userNameAsp)
        params.append('Message', this.aspiration)
        params.append('Which', Aspiration)
        // websocketには(メッセージ内容, 送信者, 抱負か振り返りか)の形式で送信
        asp = this.aspiration + "," + "MyID" + "," + Aspiration
        websocket.send(asp)
        
        // 自分のと送信して戻ってきたので2つ表示されたのでとりあえずコメントアウト中
        // this.pushMessage(this.aspiration, "MyID", Aspiration)

        // 送ったらフォームをクリア 
        this.aspiration = "";

        // axiosにパスを投げる
        axios.post('/sendMessageAspiration', params)
        .then(response =>{
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                // this.fetchAllMessageAspiration()
            }
        })
      
        // 以下, 反省に関しても同様
      }else if (flag == Lookback){
        if (this.lookback == ""){
            return;
        }
        params.append('UserName', this.userNameLkb)
        params.append('Message', this.lookback)
        params.append('Which', Lookback)
        lkb = this.lookback + "," + "MyID" + "," + Lookback;
        websocket.send(lkb)
        // this.pushMessage(this.lookback, "MyID", Lookback)
        this.lookback = "";

        axios.post('/sendMessageLookback', params)
        .then(response =>{
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                // this.fetchAllMessageLookback()
            }
        })
      }
    },

    /**
     * リストにメッセージを追加する
     * @param {String} message - 追加するメッセージ
     * @param {String} owner - 発言者
     * @param {String} flag - 振り返りか抱負か, 必要に応じてintにします
     * 
     * Websocket側でメッセを受け取った時にだけ使ってるけど正直使わなくてもいい
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
    
    /**
     * 抱負の全投稿を取得する
     */
    fetchAllMessageAspiration(){
        // axiosにパス+ルームIDを投げる(重要)
        axios.get('/fetchallasp/'+location.pathname.replace('/room/', ''))
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{

                // 後述するが, 帰ってくるのはJSONのリストなので, 
                // 頭悪いけど一個ずつ取得している
                var resultAsp = response.data
                for(i=0; i<resultAsp.length; i++){
                    this.aspiration_his.push({
                        aspiration: resultAsp[i].Message,
                        owner: resultAsp[i].User,
                        // flag: resultAsp[i].Which
                    })
                }
            }
        })
    },

    /**
     * 反省の全投稿を取得する ほぼ同上
     */
    fetchAllMessageLookback(){
        axios.get('/fetchalllkb/'+location.pathname.replace('/room/', ''))
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                var resultLkb = response.data
                for(i=0; i<resultLkb.length; i++){
                    this.lookback_his.push({
                        lookback: resultLkb[i].Message,
                        owner: resultLkb[i].User,
                        // flag: resultLkb[i].Which
                    })
                }
            }
        })
    },

    /**
     * 特定のIDの人の投稿のみを抽出, 表示する
     * この状態で投稿がクリックされたら削除するような処理にすることで, 
     * 自分の投稿のみ削除できるような機能を実装した
     */
    fetchUser(){
        // urlにルーム情報+ユーザ情報を載せる ユーザの条件もselectに使いたいので
        axios.get('/fetchuser/'+location.pathname.replace('/room/', '') + "/" + this.userID)
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                // レスポンスはJSONのリスト
                // 欲しい情報を拾って適宜dataに突っ込む
                var result = response.data
                this.lookback_his = []
                this.aspiration_his = []
                // fetchUser()の特徴はここ. 投稿を取得する時についでに投稿のIDも集めてきて格納する
                for(var i=0; i<result.length; i++){
                    if(result[i].Which == 0){
                        console.log(result[i].Message)
                        this.aspiration_his.push({
                            aspiration: result[i].Message,
                            owner: result[i].User,
                            mesid: result[i].ID
                        })
                    }else if (result[i].Which == 1){
                        this.lookback_his.push({
                            lookback: result[i].Message,
                            owner: result[i].User,
                            mesid: result[i].ID
                        })
                    }
                }
                // これが走ったときだけ投稿削除可能フラグを建てる
                this.delflag = 1;
            }
        })
    },

    /**
     * 自分の投稿のみが表示されている状態を戻す, が実質最新の情報に更新みたいなもの
     */
    returnFetch(){
        this.lookback_his = []
        this.aspiration_his = []
        this.fetchAllMessageAspiration()
        this.fetchAllMessageLookback()
        this.delflag = 0;
    },

    /**
     * 念願の投稿を削除する機構
     * @param {item} message - 削除したいメッセージ構造体. ただし, ここでいう構造体は
     * 　　　　　　　　　　　　　　Vue内でのみ定義されているもの(aspiration_his, lookback_his)
     */
    doDeleteMessage(message){
        // 削除フラグがtrue(自分の投稿のみ表示している状態)なら削除処理を行う
        if(this.delflag){
            // this.askMessageID()
            // fetchUserで投稿のIDを集めてくる
            this.fetchUser()
            const params = new URLSearchParams();
            params.append('ID', message.mesid)

            axios.post('/deleteMessage/'+location.pathname.replace('/room/', ''), params)
            .then(response => {
                if(response.status != 200){
                    throw new Error('レスポンスエラー')
                }else{
                    // 再表示のためにreturnFetchとかしてたけど, 
                    // 削除したのが他の人に伝わらない → ページ更新がされなかったので, 
                    // websocketに空文字列を送ることで疑似ブロードキャスト

                    // this.fetchUser()
                    websocket.send("")
                }
            })
        } else {
        }
    },

    /**
     * 投稿のIDを集める関数だったけどfetchUser()に統合. 
     */
    /*
    askMessageID(){
        axios.get('/askMID/'+location.pathname.replace('/room/', ''))
        .then(response => {
            if(response.status != 200){
                throw new Error('レスポンスエラー')
            }else{
                var result = response.data
                this.lookback_his = []
                this.aspiration_his = []
                for(var i=0; i<result.length; i++){
                    if(result[i].Which == 0){
                        console.log(result[i].Message)
                        this.aspiration_his.push({
                            aspiration: result[i].Message,
                            owner: result[i].User,
                            mesid: result[i].ID,
                        })
                    }else if (result[i].Which == 1){
                        this.lookback_his.push({
                            lookback: result[i].Message,
                            owner: result[i].User,
                            mesid: result[i].ID,
                        })
                    }
                }
            }
        })

    },
    */

    // ユーザIDの生成
    generateID() {
        // 中身はルームID生成と同じ
        axios.get("/generateRN").then((response) => {
          // 応答に不備があったらエラー
          if (response.status != 200) {
            throw new Error("Response Error");
          } else {
            // controllerから帰ってきた乱数を取得
            var randomnumber = response.data;
  
            // 帰ってきた乱数を遷移するURLに設定
            this.userID = randomnumber;
          }
        });
    }

  },

  mounted: function () {
    // ページが読み込まれたらその部屋の履歴を取得+自分のIDの生成
    this.fetchAllMessageAspiration()
    this.fetchAllMessageLookback()
    this.generateID()

    let self = this;
    // websocketイベントハンドラ
    websocket.onmessage = function (event) {
      console.log("### websocket.onmessage()");
      console.log(event.data)

      // 戻り値チェック 中身があるなら通常通り
      if (event && event.data) {
        // 受信したメッセージを履歴に追加
        // ,でsplitしてpushMessageに渡せるように
        var receive = (event.data.split(','));
        self.pushMessage(receive[0], receive[1], receive[2]);
      
      //中身がないなら全体に更新を促す疑似ブロードキャスト
      }else if(event.data == ""){
        self.returnFetch()
      }
    };
  },
});
