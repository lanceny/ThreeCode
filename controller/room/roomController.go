package roomcontroller

import (
    // 文字列と基本データ型の変換パッケージ
    strconv "strconv"

    // Gin
    "github.com/gin-gonic/gin"

    // エンティティ(データベースのテーブルの行に対応)
    entity "ThreeCode/model/entity"

    // DBアクセス用モジュール
    db "ThreeCode/model/db"

    //"fmt"
)

const (
    //抱負
    Aspiration = 0

    //振り返り
    LookBack = 1
)

// 全ての抱負のメッセージを取得
func Fetch_AllMessage_Aspiration(c *gin.Context) {
    roomname := c.Param("roomid")
    resultMessage := db.FindAllMessage(Aspiration, roomname)

    // URLへのアクセスに対してJSONを返す
    c.JSON(200, resultMessage)
}

// 全ての振り返りのメッセージを取得
func Fetch_AllMessage_Lookback(c *gin.Context) {
    roomname := c.Param("roomid")
    resultMessage := db.FindAllMessage(LookBack, roomname)
    
    // URLへのアクセスに対してJSONを返す
    c.JSON(200, resultMessage)
}

//振り返りの方の抱負の方のメッセージ送信
func Send_Message_Aspiration(c *gin.Context){
    UserName := c.PostForm("UserName")
    Message := c.PostForm("Message")
    Anonymousstr := c.PostForm("Anonymous")
    Anonymous, _ := strconv.Atoi(Anonymousstr)
    roomname := c.PostForm("Roomname")
    whichstr := c.PostForm("Which")
    which, _ := strconv.Atoi(whichstr)

    var room = entity.Message{
        User:       UserName,
        Message:    Message,
        Anonymous:  Anonymous,
        Which:      which,
        Roomname:   roomname,
    }

    db.Send_Message(&room, roomname)
}

//振り返りの方のメッセージ送信
func Send_Message_Lookback(c *gin.Context){
    UserName := c.PostForm("UserName")
    Message := c.PostForm("Message")
    Anonymousstr := c.PostForm("Anonymous")
    Anonymous, _ := strconv.Atoi(Anonymousstr)
    roomname := c.PostForm("Roomname")
    whichstr := c.PostForm("Which")
    which, _ := strconv.Atoi(whichstr)

    var room = entity.Message{
        User:       UserName,
        Message:    Message,
        Anonymous:  Anonymous,
        Which:      which,
        Roomname:   roomname,
    }

    db.Send_Message(&room, roomname)
}
