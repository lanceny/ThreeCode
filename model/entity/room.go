package entity

// Product はテーブルのモデル
// Whichが0なら抱負のメッセージ，1なら振り返りのメッセージ
type Message struct {
    ID    		int    `gorm:"primary_key;not null;AUTO_INCREMENT"       	json:"id"`
    User  		string `gorm:"type:varchar(100);not null" 	                json:"user"`
    Message  	string `gorm:"type:varchar(2000)"       	                json:"message"`
    Anonymous 	int    `gorm:"not null"                   	                json:"anonymous"`
    Which       int    `gorm:"not null"                   	                json:"which"`
    Roomname   string `gorm:"type:varchar(100);                            json:"room_name"`
    Userid     string `gorm:"type:varchar(100);                             json:"userid"` // 個別識別のためにUserID項目を追加
}

// テーブル名を指定
func (b Message) TableName() string {
    return b.Roomname
}
