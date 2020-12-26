new Vue({
    // elの要素配下でindexVue.jsが有効になる. 今回はdiv id="app"を指定
    el: '#app',

    data:{
        currentPage: 'home'
    },

    methods:{
        // 乱数の生成
        generateRN(){
            // serverに'/generateRN'を呼んでねってリクエスト
            axios.get('/generateRN')
            .then(response => {
                // 応答に不備があったらエラー
                if(response.status != 200){
                    throw new Error('Response Error')
                }else{
                    // controllerから帰ってきた乱数を取得
                    var randomnumber = response.data

                    // 帰ってきた乱数を遷移するURLに設定
                    this.currentPage = randomnumber
                }
            })
            window.location = "/room" + this.currentPage             
        }
    }
})