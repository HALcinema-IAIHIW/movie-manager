package request

type CreateReservationSeatRequest struct {
	PurchaseID uint `json:"purchase_id" binding:"required"`
	SeatID     uint `json:"seat_id" binding:"required"`
}
