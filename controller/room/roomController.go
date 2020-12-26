package roomcontroller

import (
    // 文字列と基本データ型の変換パッケージ
    // strconv "strconv"

    // Gin
    "github.com/gin-gonic/gin"

    // エンティティ(データベースのテーブルの行に対応)
    entity "ThreeCode/model/entity"

    // DBアクセス用モジュール
    db "ThreeCode/model/db"
)

const (
    //抱負
    Aspiration = 0

    //振り返り
    LookBack = 1
)

// 全ての抱負のメッセージを取得
func Fetch_AllMessage_Aspiration(c *gin.Context) {
    room_name := c.PostForm("room_name")
    resultMessage := db.FindAllMessage(Aspiration,room_name)

    // URLへのアクセスに対してJSONを返す
    c.JSON(200, resultMessage)
}

// 全ての振り返りのメッセージを取得
func Fetch_AllMessage_Lookback(c *gin.Context) {
    room_name := c.PostForm("room_name")
    resultMessage := db.FindAllMessage(LookBack,room_name)
    
    // URLへのアクセスに対してJSONを返す
    c.JSON(200, resultMessage)
}

//振り返りの方の抱負の方のメッセージ送信
func Send_Message_Aspiration(c *gin.Context){
    UserName := c.PostForm("UserName")
    Message := c.PostForm("Message")
    Anonymous := c.PostForm("Anonymous")
    room_name := c.PostForm("room_name")

    var room = entity.message{
        User:       UserName,
        Message:    Message,
        Anonymous:  Anonymous,
        Which:      Aspiration,
    }

    db.Send_Message(&room,room_name)
}

//振り返りの方のメッセージ送信
func Send_Message_Lookback(c *gin.Context){
    UserName := c.PostForm("UserName")
    Message := c.PostForm("Message")
    Anonymous := c.PostForm("Anonymous")
    room_name := c.PostForm("room_name")

    var room = entity.message{
        User:       UserName,
        Message:    Message,
        Anonymous:  Anonymous,
        which:      LookBack,
    }

    db.Send_Message(&room,room_name)
}
