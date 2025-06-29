package presenter

import (
	"modules/src/database/model"
)

type SeatResponse struct {
	ID         uint   `json:"id"`
	ScreenID   uint   `json:"screen_id"`
	Row        string `json:"row"`
	Column     int    `json:"column"`
	SeatTypeID uint   `json:"seat_type_id"`
}

func ToSeatResponse(seat model.Seat) SeatResponse {
	return SeatResponse{
		ID:         seat.ID,
		ScreenID:   seat.ScreenID,
		Row:        seat.Row,
		Column:     seat.Column,
		SeatTypeID: seat.SeatTypeID,
	}
}

func ToSeatResponseList(seats []model.Seat) []SeatResponse {
	list := make([]SeatResponse, len(seats))
	for i, seat := range seats {
		list[i] = ToSeatResponse(seat)
	}
	return list
}
