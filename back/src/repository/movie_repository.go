package repository

import "modules/src/database/model"

type MovieRepository interface {
	Create(movie *model.Movie) error
	FindAll() ([]model.Movie, error)
	FindByID() (model.Screen, error)
}
