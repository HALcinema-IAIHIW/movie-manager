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
	Update(user *model.User) error
	IsAdmin(userID uint) (bool, error)
	CreateAdmin(admin *model.Admin) error
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

func (r *GormUserRepository) Update(user *model.User) error {
	result := r.db.Save(user)
	return result.Error
}

func (r *GormUserRepository) IsAdmin(userID uint) (bool, error) {
	var count int64
	err := r.db.Table("admins").Where("user_id = ? AND deleted_at IS NULL", userID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *GormUserRepository) CreateAdmin(admin *model.Admin) error {
	return r.db.Create(admin).Error
}
