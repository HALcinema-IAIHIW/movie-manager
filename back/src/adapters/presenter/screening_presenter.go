package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
	"modules/src/util"
	"time"
)

func ToScreeningResponse(screening model.Screening) response.ScreeningResponse {
	endTime := screening.StartTime.Add(time.Duration(screening.Duration) * time.Minute)
	return response.ScreeningResponse{
		ID:                screening.ID,
		ScreeningPeriodID: screening.ScreeningPeriodID,
		Movie: response.MovieInfo{
			ID:         screening.ScreeningPeriod.Movie.ID,
			Title:      screening.ScreeningPeriod.Movie.Title,
			PosterPath: util.BuildPosterPath(screening.ScreeningPeriod.Movie.PosterPath),
		},
		Screen: response.ScreenInfo{
			ID: screening.Screen.ID,
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

func BuildMovieTLResponse(screenings []model.Screening) []response.MovieTLResponse {
	movieMap := map[uint]response.MovieTLResponse{}

	for _, s := range screenings {
		movie := s.ScreeningPeriod.Movie

		showing := response.ShowingInfo{
			ScreeningID: s.ID,
			StartTime:   s.StartTime.Format("15:04"),
			EndTime:     s.StartTime.Add(time.Duration(s.Duration) * time.Minute).Format("15:04"),
		}

		mtl, exists := movieMap[movie.ID]
		if !exists {
			mtl = response.MovieTLResponse{
				MovieId:    movie.ID,
				Title:      movie.Title,
				PosterPath: util.BuildPosterPath(movie.PosterPath),
				ScreenID:   s.ScreenID,
				Showings:   []response.ShowingInfo{},
				Date:       s.Date.Format("2006-01-02"),
			}
		}

		mtl.Showings = append(mtl.Showings, showing)
		movieMap[movie.ID] = mtl
	}

	// map → slice に変換
	responses := make([]response.MovieTLResponse, 0, len(movieMap))
	for _, v := range movieMap {
		responses = append(responses, v)
	}

	return responses
}
