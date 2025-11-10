package usecases

import (
	"modules/src/database/model"
)

type MovieUsecase struct {
	MovieRepo MovieRepository
}

type MovieRepository interface {
	CreateMovie(movie *model.Movie) error
	FindAllMovies() ([]model.Movie, error)
	GetMovieByID(id uint) (*model.Movie, error)
	UpdatePosterPath(id uint, posterPath string) error
}

func (u *MovieUsecase) CreateMovie(movie *model.Movie) error {
	return u.MovieRepo.CreateMovie(movie)
}

func (u *MovieUsecase) GetAllMovies() ([]model.Movie, error) {
	return u.MovieRepo.FindAllMovies()
}

func (u *MovieUsecase) GetMovieById(id uint) (*model.Movie, error) {
	return u.MovieRepo.GetMovieByID(id)
}

func (u *MovieUsecase) UpdateMoviePoster(id uint, posterPath string) (*model.Movie, error) {
	if err := u.MovieRepo.UpdatePosterPath(id, posterPath); err != nil {
		return nil, err
	}
	return u.MovieRepo.GetMovieByID(id)
}
