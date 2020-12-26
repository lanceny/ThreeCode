package entity

// Product はテーブルのモデル
type message struct {
    ID    		int    `gorm:"primary_key;not null"       	json:"id"`
    User  		string `gorm:"type:varchar(100);not null" 	json:"user"`
    Message  	string `gorm:"type:varchar(2000)"       	json:"message"`
	Anonymous 	bool   `gorm:"not null"                   	json:"anonymous"`
}
