package movie

import (
	"modules/database/model"
	"modules/datastructure/response"
)

func ToMovieResponse(movie model.Movie) response.MovieResponse {
	return response.MovieResponse{
		ID:          movie.ID,
		Title:       movie.Title,
		Description: movie.Description,
		ReleaseDate: movie.ReleaseDate.Format("2006-01-02"),
		Genre:       movie.Genre,
		Director:    movie.Director,
	}
}

func ToMovieResponseList(movies []model.Movie) []response.MovieResponse {
	var res []response.MovieResponse
	for _, m := range movies {
		res = append(res, ToMovieResponse(m))
	}
	return res
}
