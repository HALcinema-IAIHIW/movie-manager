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
