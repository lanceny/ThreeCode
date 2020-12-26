package db

import (
	// フォーマットI/O
	"fmt"
	// GolangのORM
	"github.com/jinzhu/gorm"
	// エンティティ(データベースのテーブルの行に対応)
	entity "ThreeCode/model/entity"
)

// DB接続する
func open(table_name string) *gorm.DB {
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
	// テーブルが無い時は自動生成,テーブル名=部屋名(自動生成した文字列)
    db.AutoMigrate(&entity.message{Room_name: table_name})

	// データベースに接続できたことを示す
	fmt.Println("db connected: ", &db)
	
    return db
}

//指定されたテーブル名のメッセージを取得．whichで抱負か振り返りかを判断
func FindAllMessage(which int, table_name string)[]entity.message{
	message := []entity.message{}

	db := open(table_name)

	//SQL文
	//SELECT User,Message,Anonymous FROM table_name WHERE Which=which ORDER BY ID;
	db.Select("User,Message,Anonymous").Where("Which = ?",which).Order("ID asc").Find(&message)

	defer db.Close()
	return message
}


//抱負,振り返りを追加する
func Send_Message(registerMessage *entity.message, table_name string){
	db := open(table_name)
	db.Create(&registerMessage)
	defer db.Close()
}


/*
//指定されたメッセージを削除，メッセージを送信したユーザと削除するユーザが一致していれば削除
func Delete_Message(message_ID int, user string, table_name string){
	
}
*/
