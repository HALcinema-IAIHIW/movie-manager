package request

type PeriodRequest struct {
	MovieID   uint   `json:"movieID" binding:"required"`
	StartDate string `json:"startDate" binding:"required"`
	EndDate   string `json:"endDate" binding:"required"`
}
