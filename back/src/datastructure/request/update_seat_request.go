package dto

type UpdateSeatRequest struct {
	Row        *string `json:"row,omitempty"`
	Column     *int    `json:"column,omitempty,gte=1"`
	SeatTypeID *uint   `json:"seat_type_id,omitempty"`
}
