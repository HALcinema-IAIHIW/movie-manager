// modules/src/response/purchase.go  <-- 新しいパッケージとファイル
package response

import (
	"gorm.io/gorm" // gorm.Model を使用するためインポート
	"time"
)

type Purchase struct {
	gorm.Model             // GORMの共通フィールドを含める場合
	ID           uint      `json:"id"`
	UserID       uint      `json:"user_id"`
	ScreeningID  uint      `json:"screening_id"`
	PurchaseTime time.Time `json:"purchase_time"` // JSONタグを追加
	TotalPrice   int       `json:"total_price"`   // JSONタグを追加
}
