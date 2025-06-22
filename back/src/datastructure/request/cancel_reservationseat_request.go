package request

type CancelReservationSeatRequest struct {
	// キャンセル対象の予約 ID など
	ReservationSeatID uint `json:"reservation_seat_id" binding:"required"`
}
