package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
	"time"
)

func ToScreeningResponse(screening model.Screening) response.ScreeningResponse {
	endTime := screening.StartTime.Add(time.Duration(screening.Duration) * time.Minute)
	return response.ScreeningResponse{
		ID:                screening.ID,
		ScreeningPeriodID: screening.ScreeningPeriodID,
		Movie: response.MovieInfo{
			ID:        screening.ScreeningPeriod.Movie.ID,
			Title:     screening.ScreeningPeriod.Movie.Title,
			PosterUrl: screening.ScreeningPeriod.Movie.PosterPath,
		},
		Screen: response.ScreenInfo{
			ID: screening.ScreeningPeriod.Screen.ID,
		},
		Date:      screening.Date,
		StartTime: screening.StartTime,
		EndTime:   endTime.Format("15:04"),
	}
}

func ToScreeningResponseList(screenings []model.Screening) []response.ScreeningResponse {
	var res []response.ScreeningResponse
	for _, s := range screenings {
		res = append(res, ToScreeningResponse(s))
	}
	return res
}
