package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToPeriodResponse(period model.ScreeningPeriod) response.PeriodResponse {
	return response.PeriodResponse{
		ID:        period.ID,
		MovieID:   period.MovieID,
		ScreenID:  period.ScreenID,
		StartDate: period.StartDate,
		EndDate:   period.EndDate,
	}
}

func ToPeriodsResponses(periods []model.ScreeningPeriod) []response.PeriodResponse {
	res := make([]response.PeriodResponse, len(periods))
	for i, p := range periods {
		res[i] = ToPeriodResponse(p)
	}
	return res
}
