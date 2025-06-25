package usecase

import (
	"modules/database/model"
)

type MovieUsecase struct {
	MovieRepo MovieRepository
}

type MovieRepository interface {
	Create(movie *model.Movie) error
	FindAll() ([]model.Movie, error)
}

func (u *MovieUsecase) CreateMovie(movie *model.Movie) error {
	return u.MovieRepo.Create(movie)
}

func (u *MovieUsecase) GetAllMovies() ([]model.Movie, error) {
	return u.MovieRepo.FindAll()
}
