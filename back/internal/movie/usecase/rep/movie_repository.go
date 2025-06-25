package rep

import (
	"modules/database/model"
)

type MovieRepository interface {
	Create(movie *model.Movie) error
	FindAll() ([]model.Movie, error)
	FindByID(id uint) (*model.Movie, error)
}
