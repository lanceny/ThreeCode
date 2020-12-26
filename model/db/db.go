package db

import (
	// フォーマットI/O
	"fmt"
	// GolangのORM
	"github.com/jinzhu/gorm"
	// エンティティ(データベースのテーブルの行に対応)
	// entity "ThreeCode/model/entity"
)

// DB接続する
func open() *gorm.DB {
	DBMS := "mysql"
    USER := "threecode"
    PASS := "3cvol5"
    PROTOCOL := "tcp(localhost:3306)"
    DBNAME := "threecode_db"
    CONNECT := USER + ":" + PASS + "@" + PROTOCOL + "/" + DBNAME
	db, err := gorm.Open(DBMS, CONNECT)
	
	if err != nil {
        panic(err.Error())
	}
	
	// DBエンジンを「InnoDB」に設定
    db.Set("gorm:table_options", "ENGINE=InnoDB")

    // 詳細なログを表示
    db.LogMode(true)

    // 登録するテーブル名を単数形にする（デフォルトは複数形）
    db.SingularTable(true)

	// マイグレーション(DBに保存されているデータを保持したまま、テーブルの作成やカラムの変更などを行う)
	// テーブルが無い時は自動生成
    // db.AutoMigrate(&entity.Product{})

	// データベースに接続できたことを示す
	fmt.Println("db connected: ", &db)
	
    return db
}


// 抱負側の処理
//抱負を追加する
func Send_Message_Aspiration(user string, Message string, Anonymous bool, table_name string){

}

//指定されたメッセージを削除，メッセージを送信したユーザと削除するユーザが一致していれば削除
func Delete_Message_Aspiration(message_ID int, user string, table_name string){

}

// 振り返り側の処理
//振り返りを追加する
func Send_Message_Aspiration_LookBack(user string, Message string, Anonymous bool, table_name string){

}

//指定されたメッセージを削除，メッセージを送信したユーザと削除するユーザが一致していれば削除
func Delete_Message_LookBack(message_ID int, user string, table_name string){

}
