package main

import (
	// ロギングを行うパッケージ
	"log"

	// HTTPを扱うパッケージ
	"net/http"

	// Gin
	"github.com/gin-gonic/gin"

	//melody
	melody "gopkg.in/olahol/melody.v1"

	// MySQL用ドライバ
	_ "github.com/jinzhu/gorm/dialects/mysql"
	// コントローラー
	indexController "ThreeCode/controller/index"
	roomController "ThreeCode/controller/room"
)

func main() {
  // サーバーを起動する
  serve()
}

func serve() {
  // デフォルトのミドルウェアでginのルーターを作成
  // Logger と アプリケーションクラッシュをキャッチするRecoveryミドルウェア を保有しています
	ginRouter := gin.Default()
	melodyInstance := melody.New()

  // 静的ファイルのパスを指定
	ginRouter.Static("/view", "./view")
	
	// HTML読み込み,これによりテンプレートを使用できる
	ginRouter.LoadHTMLGlob("view/*.html")

	// index.htmlはr.LoadHTMLGlob()でロードされているファイルから読み込む
	ginRouter.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	
	// (部屋を示す文字列)にリクエストが来たらroom.htmlを返す
	// :nameのparamを取得しHTMLにRoom_Nameという変数で渡す値を格納しておく
	ginRouter.GET("room/:name", func(c *gin.Context) {
		c.HTML(http.StatusOK, "room.html", gin.H{
			"Room_Name": c.Param("name"),
		})
	})

	// /:name/wsにリクエストが来ると，webSocketの通信として、HandleMessageの処理を行う
	// HandleRequestは、httpリクエストをWebSocket接続にし、melodyインスタンスによって処理されるようにディスパッチする
	ginRouter.GET("room/:name/ws", func(c *gin.Context) {
		melodyInstance.HandleRequest(c.Writer, c.Request)
	})

	// 部屋名(URL)が同じクライアントのみに，送られてきた値を送信する
	// 部屋名が同じクライアントのみに送りたいので、BroadcastFilterをかけている
	melodyInstance.HandleMessage(func(s *melody.Session, msg []byte) {
		melodyInstance.BroadcastFilter(msg, func(q *melody.Session) bool {
			return q.Request.URL.Path == s.Request.URL.Path
		})
	})

	ginRouter.GET("/generateRN",indexController.GenerateRN)

	ginRouter.POST("/sendMessageAspiration", roomController.Send_Message_Aspiration)

	ginRouter.POST("/sendMessageLookback", roomController.Send_Message_Lookback)

	ginRouter.GET("/fetchallasp/:roomid", roomController.Fetch_AllMessage_Aspiration)

	ginRouter.GET("/fetchalllkb/:roomid", roomController.Fetch_AllMessage_Lookback)

	ginRouter.GET("/fetchuser/:roomid/:userid", roomController.Fetch_SameID)

	// ginRouter.POST("/fetchrmnm", roomController.Fetch_roomname)
	
	// 8080ポートで待ち受ける
  if err := ginRouter.Run(":8080"); err != nil {
     log.Fatal("Server Run Failed.: ", err)
  }
}
