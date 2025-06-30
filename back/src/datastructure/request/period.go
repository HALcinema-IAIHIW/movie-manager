package request


type PeriodRequest struct {
	MovieID   uint   `json:"movieID" binding:"required"`
	ScreenID  uint   `json:"screenID" binding:"required"`
	StartDate string `json:"startDate" binding:"required"`
	EndDate   string `json:"endDate" binding:"required"`
}
