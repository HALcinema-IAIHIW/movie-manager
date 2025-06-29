package request

// CreateSeatRequest は座席作成のリクエストボディを表します
type CreateSeatRequest struct {
	ScreenID   uint   `json:"screen_id" binding:"required"`
	Row        string `json:"row" binding:"required"`
	Column     int    `json:"column" binding:"required"`
	SeatTypeID uint   `json:"seat_type_id" binding:"required"`
}
