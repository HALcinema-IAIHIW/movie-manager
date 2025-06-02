package dto

type PaymentStatus string

const (
	Pending PaymentStatus = "pending"
	Paid    PaymentStatus = "paid"
	Failed  PaymentStatus = "failed"
)

type CreatePurchaseRequest struct {
	UserID        uint          `json:"user_id" binding:"required"`
	ScreeningID   uint          `json:"screening_id" binding:"required"`
	TotalPrice    int           `json:"total_price" binding:"required,gte=0"`
	PaymentStatus PaymentStatus `json:"payment_status" binding:"required,oneof=pending paid failed"`
	PurchaseTime  string        `json:"purchase_time" binding:"required,datetime=2006-01-02T15:04:05Z07:00"` // ISO 8601 形式などを想定
}
