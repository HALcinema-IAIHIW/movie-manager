package dto

type UpdatePurchaseRequest struct {
	PaymentStatus *PaymentStatus `json:"payment_status,omitempty,oneof=pending,paid,failed"`
}
