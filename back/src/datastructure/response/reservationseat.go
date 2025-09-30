package response

import "time"

type ReservationSeatResponse struct {
	ID          uint       `json:"id"`
	PurchaseID  uint       `json:"purchase_id"`
	SeatID      uint       `json:"seat_id"`
	IsCancelled bool       `json:"is_cancelled"`
	CancelledAt *time.Time `json:"cancelled_at,omitempty"` // nullの場合に省略
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type UserReservationResponse struct {
	PurchaseID        uint       `json:"purchase_id"`
	ReservationSeatID uint       `json:"reservation_seat_id"`
	MovieTitle        string     `json:"movieTitle"`
	Date              string     `json:"date"`
	Time              string     `json:"time"`
	EndTime           string     `json:"endTime"`
	Screen            string     `json:"screen"`
	Seat              string     `json:"seat"`
	PosterPath        string     `json:"poster_path"`
	TimeUntil         string     `json:"timeUntil"`
	IsCancelled       bool       `json:"is_cancelled"`
	CancelledAt       *time.Time `json:"cancelled_at,omitempty"`
}
