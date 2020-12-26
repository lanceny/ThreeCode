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
	//roomController "ThreeCode/controller"
)

func main() {
    // サーバーを起動する
    serve()
}

func serve() {
    // デフォルトのミドルウェアでginのルーターを作成
    // Logger と アプリケーションクラッシュをキャッチするRecoveryミドルウェア を保有しています
	router := gin.Default()
	m := melody.New()

    // 静的ファイルのパスを指定
	router.Static("/view", "./view")
	
	// HTML読み込み,これによりテンプレートを使用できる
	router.LoadHTMLGlob("view/*.html")

	// index.htmlはr.LoadHTMLGlob()でロードされているファイルから読み込む
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})
	
	// /(部屋を示す文字列)にリクエストが来たらroom.htmlを返す
	router.GET("room/:name", func(c *gin.Context) {
		c.HTML(http.StatusOK, "room.html", gin.H{
			"Room_Name": c.Param("room_name"),
		})
	})

	// /:name/wsにリクエストが来ると，webSocketの通信として、HandleMessageの処理を行う
	// HandleRequestは、httpリクエストをWebSocket接続にし、melodyインスタンスによって処理されるようにディスパッチする
	router.GET("room/:name/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	router.GET("/generateRN",indexController.GenerateRN)

	// 部屋名(URL)が同じクライアントのみに，送られてきた値を送信する
	
	m.HandleMessage(func(s *melody.Session, msg []byte) {
		m.BroadcastFilter(msg, func(q *melody.Session) bool {
			return q.Request.URL.Path == s.Request.URL.Path
		})
	})
	
	// 8080ポートで待ち受ける
    if err := router.Run(":8080"); err != nil {
        log.Fatal("Server Run Failed.: ", err)
    }
}
