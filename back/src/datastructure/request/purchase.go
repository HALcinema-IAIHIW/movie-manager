package request

type CreatePurchaseRequest struct {
	UserID          uint                          `json:"user_id" binding:"required"`
	ScreeningID     uint                          `json:"screening_id" binding:"required"`
	PurchaseTime    string                        `json:"purchase_time" binding:"required,datetime=2006-01-02T15:04:05Z07:00"`
	PurchaseDetails []CreatePurchaseDetailRequest `json:"purchase_details" binding:"required,min=1,dive"`
}

type CreatePurchaseDetailRequest struct {
	RoleID   uint `json:"role_id" binding:"required"`
	Quantity int  `json:"quantity" binding:"required,gte=1"`
}
