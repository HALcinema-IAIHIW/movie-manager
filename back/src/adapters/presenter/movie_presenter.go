package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
	"strings"
)

func ToMovieResponse(movie model.Movie) response.MovieResponse {
	return response.MovieResponse{
		ID:          movie.ID,
		Title:       movie.Title,
		SubTitle:    movie.SubTitle,
		Description: movie.Description,
		ReleaseDate: movie.ReleaseDate.Format("2006-01-02"),
		Genre:       movie.Genre,
		Director:    movie.Director,
		Cast:        strings.Split(movie.Cast, ","),
		Duration:    movie.Duration,
		PosterPath:  movie.PosterPath,
	}
}

func ToMovieResponseList(movies []model.Movie) []response.MovieResponse {
	var res []response.MovieResponse
	for _, m := range movies {
		res = append(res, ToMovieResponse(m))
	}
	return res
}
