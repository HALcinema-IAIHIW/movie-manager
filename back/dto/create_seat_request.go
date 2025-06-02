package dto

type CreateSeatRequest struct {
	ScreenID   uint   `json:"screen_id" binding:"required"`
	Row        string `json:"row" binding:"required"`
	Column     int    `json:"column" binding:"required,gte=1"`
	SeatTypeID uint   `json:"seat_type_id" binding:"required"`
}
