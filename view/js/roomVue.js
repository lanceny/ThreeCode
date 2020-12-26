function main(){
    // WebSocketインスタンスの設定
    var locate = "ws://" + window.location.host + window.location.pathname + "/ws";
    var ws = new WebSocket(locate);


    new Vue({
        // elの要素配下でindexVue.jsが有効になる. 今回はdiv id="app"を指定
        el: "#app",

        data() {
            return{
                // URLを格納
                url: "",
                sends: "", // 入力したメッセージの格納
                history: [], // 送受信したメッセの格納
            }
        },

        methods: {
            CopyURL(){
                // 今いるところのURLを取得
                url = location.href;

                // textBoxを作成. コンテンツに取得したURLをいれる
                // textBoxの内容を選択してコピーすることで
                // クリップボードにコピーしている
                var textBox = document.createElement("textarea");
                textBox.setAttribute("id", "target");
                textBox.setAttribute("type", "hidden");
                textBox.textContent = url;
                document.body.appendChild(textBox);
            
                textBox.select();
                document.execCommand('copy');
                document.body.removeChild(textBox);
            },
            
            // 投稿を送信
            sendMessage(){
                // 未入力なら終了
                if (this.sends == ""){
                    return;
                }

                // 投稿を送信
                ws.send(this.sends);

                // 送信した内容を表示
                this.showMessage(this.sends);

                // 投稿の初期化
                this.sends = "";
            },


            // メッセージの表示
            showMessage: function(sends){
                // メッセージを追加
                this.history.push({
                    "message": sends,
                });
            }
        },

        mounted: function(){
            var self = this;
            
            // メッセージがきたら受け取る
            websocket.onmessage = function(event){
                self.showMessage(event.data);
            };
        }
    });
};

window.onload = function(){
    main();
};