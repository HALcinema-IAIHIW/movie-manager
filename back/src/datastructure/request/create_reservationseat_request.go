package request

type CreateReservationSeatRequest struct {
	UserID      uint `json:"user_id" binding:"required"`
	ScreeningID uint `json:"screening_id" binding:"required"`
	SeatID      uint `json:"seat_id" binding:"required"`
	TicketID    uint `json:"ticket_id" binding:"required"`
	PurchaseID  uint `json:"purchase_id" binding:"required"`
}
