package repository

import "modules/src/database/model"

type UserRepository interface {
	Create(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	FindAll() ([]model.User, error)
	FindByID(id uint) (*model.User, error)
}
