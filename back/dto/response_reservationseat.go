package dto

import "time"

type ReservationSeatResponse struct {
	ID          uint       `json:"id"`
	UserID      uint       `json:"user_id"`
	ScreeningID uint       `json:"screening_id"`
	SeatID      uint       `json:"seat_id"`
	TicketID    uint       `json:"ticket_id"`
	PurchaseID  uint       `json:"purchase_id"`
	IsCancelled bool       `json:"is_cancelled"`
	CancelledAt *time.Time `json:"cancelled_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
