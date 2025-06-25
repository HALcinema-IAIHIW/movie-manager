package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormRoleRepository struct {
	DB *gorm.DB
}

func NewGormRoleRepository(db *gorm.DB) *GormRoleRepository {
	return &GormRoleRepository{DB: db}
}

func (r *GormRoleRepository) Create(role *model.Role) error {
	return r.DB.Create(role).Error
}

func (r *GormRoleRepository) GetFindAll(roles *[]model.Role) error {
	return r.DB.Find(roles).Error
}

// ユーザーの新規Create時に作成します
func (r *GormRoleRepository) GetByRoleName(roleName string) (*model.Role, error) {
	var role model.Role
	if err := r.DB.Where("role_name = ?", roleName).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}
