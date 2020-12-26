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
func open(rmnm string) *gorm.DB {
	DBMS := "mysql"
    USER := "root"
    PASS := "root"
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
    db.Table(rmnm).AutoMigrate(&entity.Message{})

	// データベースに接続できたことを示す
	fmt.Println("db connected: ", &db)
	
    return db
}

//指定されたテーブル名のメッセージを取得．whichで抱負か振り返りかを判断
func FindAllMessage(which int, rmnm string)[]entity.Message{
	message := []entity.Message{}

	db := open(rmnm)

	//SQL文
	//SELECT User,Message,Anonymous FROM table_name WHERE Which=which ORDER BY ID;
	//db.Table(rmnm).Select("User,Message,Anonymous").Where("Which = ?",which).Order("ID asc").Find(&message)
	db.Table(rmnm).Where("Which = ?",which).Order("ID asc").Find(&message)

	defer db.Close()

	fmt.Print(message)
	return message
}


//抱負,振り返りを追加する
func Send_Message(registerMessage *entity.Message, rmnm string){
	db := open(rmnm)
	db.Table(rmnm).Create(&registerMessage)
	defer db.Close()
}


/*
//指定されたメッセージを削除，メッセージを送信したユーザと削除するユーザが一致していれば削除
func Delete_Message(message_ID int, user string, table_name string){
	
}
*/
