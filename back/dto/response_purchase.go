package dto

import "time"

type PurchaseResponse struct {
	ID            uint                      `json:"id"`
	UserID        uint                      `json:"user_id"`
	ScreeningID   uint                      `json:"screening_id"`
	TotalPrice    int                       `json:"total_price"`
	PaymentStatus PaymentStatus             `json:"payment_status"`
	PurchaseTime  time.Time                 `json:"purchase_time"`
	CreatedAt     time.Time                 `json:"created_at"`
	UpdatedAt     time.Time                 `json:"updated_at"`
	User          *UserResponse             `json:"user,omitempty"`
	Screening     *ScreeningResponse        `json:"screening,omitempty"`
	Reservations  []ReservationSeatResponse `json:"reservations,omitempty"`
}
