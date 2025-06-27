package repository

import "modules/src/database/model"

type ScreenRepository interface {
	Create(screen *model.Screen) error
	FindAll() ([]model.Screen, error)
	FindByID(id uint) (*model.Screen, error)
}
