package request

type CreateScreenRequest struct {
	MaxRow    string `json:"max_row" binding:"required,max=10"`   // ✅ 文字列の長さ制限
	MaxColumn int    `json:"max_column" binding:"required,gte=1"` // ✅ 数値の範囲制限
}
