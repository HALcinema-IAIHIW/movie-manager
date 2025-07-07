package gateway

import (
	"errors"
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormRoleRepository struct {
	DB *gorm.DB
}

func (r *GormRoleRepository) CreateRole(role *model.Role) error {
	//TODO implement me
	panic("implement me")
}

func (r *GormRoleRepository) GetAllRoles() ([]model.Role, error) {
	//TODO implement me
	panic("implement me")
}

func (r *GormRoleRepository) GetRoleByName(name string) (*model.Role, error) {
	//TODO implement me
	panic("implement me")
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

func (r *GormRoleRepository) GetRoleByID(id uint) (*model.Role, error) { // ★このメソッドを追加★
	var role model.Role
	if err := r.DB.First(&role, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // レコードが見つからない場合はnil, nilを返す
		}
		return nil, err
	}
	return &role, nil
}
