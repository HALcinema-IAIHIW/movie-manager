package dto

import "time"

type SeatResponse struct {
	ID         uint      `json:"id"`
	ScreenID   uint      `json:"screen_id"`
	Row        string    `json:"row"`
	Column     int       `json:"column"`
	SeatTypeID uint      `json:"seat_type_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
