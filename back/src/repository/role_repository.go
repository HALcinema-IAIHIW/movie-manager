package repository

import (
	"errors"
	"gorm.io/gorm"
	"modules/src/database/model"
)

type RoleRepository interface {
	CreateRole(role *model.Role) error
	GetAllRoles() ([]model.Role, error)
	GetRoleByID(id uint) (*model.Role, error) // これがPurchaseUsecaseで使われる
	GetRoleByName(name string) (*model.Role, error)
}

type GormRoleRepository struct {
	db *gorm.DB
}

func NewGormRoleRepository(db *gorm.DB) RoleRepository {
	return &GormRoleRepository{db: db}
}

func (r *GormRoleRepository) CreateRole(role *model.Role) error {
	return r.db.Create(role).Error
}

func (r *GormRoleRepository) GetAllRoles() ([]model.Role, error) {
	var roles []model.Role
	if err := r.db.Find(&roles).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.Role{}, nil
		}
		return nil, err
	}
	return roles, nil
}

func (r *GormRoleRepository) GetRoleByID(id uint) (*model.Role, error) {
	var role model.Role
	if err := r.db.First(&role, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}

func (r *GormRoleRepository) GetRoleByName(name string) (*model.Role, error) {
	var role model.Role
	if err := r.db.Where("role_name = ?", name).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}
