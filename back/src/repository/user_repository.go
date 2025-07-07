package repository

import (
	"gorm.io/gorm"
	"modules/src/database/model"
)

type UserRepository interface {
	Create(user *model.User) error
	FindByEmail(email string) (*model.User, error)
	FindByID(id uint) (*model.User, error)
	FindAll() ([]model.User, error)
}

type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) UserRepository {
	return &GormUserRepository{db: db}
}

func (r *GormUserRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *GormUserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Preload("Role").Where("email = ?", email).First(&user).Error // Roleをプリロード
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindByID(id uint) (*model.User, error) {
	var user model.User
	err := r.db.Preload("Role").First(&user, id).Error // Roleをプリロード
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindAll() ([]model.User, error) {
	var users []model.User
	err := r.db.Preload("Role").Find(&users).Error // Roleをプリロード
	return users, err
}
