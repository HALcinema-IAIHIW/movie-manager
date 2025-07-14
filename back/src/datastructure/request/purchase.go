package request

type CreatePurchaseRequest struct {
	UserID          uint                   `json:"user_id" binding:"required"`
	ScreeningID     uint                   `json:"screening_id" binding:"required"`
	PurchaseTime    string                 `json:"purchase_time" binding:"required"` // ISO 8601形式の文字列
	PurchaseDetails []CreatePurchaseDetail `json:"purchase_details" binding:"required"`
}

type CreatePurchaseDetail struct {
	Quantity int  `json:"quantity" binding:"required,min=1"`
	RoleID   uint `json:"role_id" binding:"required"`
}
