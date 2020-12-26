package indexcontroller

import (
	//Gin
	"github.com/gin-gonic/gin"

	// 乱数生成用パッケージ
	"math/rand"
	// フォーマットI/O
	"fmt"
	// エラー処理
)

const (
	// 文字列を定義. ここからランダムに文字を並べてランダム文字列を作る
	letters = "abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

// generateRN: 乱数生成
func GenerateRN(c *gin.Context) {
	var letters = []rune("abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	
	// 乱数を生成
	b := make([]rune, 10)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	// lettersからランダムに取り出して文字列を生成
	var resultNum string
	resultNum = string(b)
	fmt.Println("generateRN",resultNum)
	c.JSON(200, resultNum)
}
