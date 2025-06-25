package rep

import (
	"modules/database/model"
)

type ScreenRepository interface {
	Create(screen *model.Screen) error
	FindAll() ([]model.Screen, error)
}
