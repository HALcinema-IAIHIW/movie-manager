package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToPeriodResponce(period model.ScreeningPeriod) response.PeriodResponce {
	return response.PeriodResponce{
		MovieID:   period.MovieID,
		ScreenID:  period.ScreenID,
		StartDate: period.StartDate,
		EndDate:   period.EndDate,
	}
}
