package usecases

import (
	"fmt"
	"modules/src/database/model"
)

type RoleUsecase struct {
	RoleRepo RoleRepository
}

type RoleRepository interface {
	Create(role *model.Role) error
	GetFindAll(role *[]model.Role) error
	GetRoleByName(name string) (*model.Role, error)
}

func (u *RoleUsecase) CreateRole(role *model.Role) error {
	return u.RoleRepo.Create(role)
}

func (u *RoleUsecase) GetAllRoles() ([]model.Role, error) {
	var roles []model.Role
	err := u.RoleRepo.GetFindAll(&roles)
	return roles, err
}

func (uc *RoleUsecase) GetRoleByName(name string) (*model.Role, error) {
	role, err := uc.RoleRepo.GetRoleByName(name) // GetByName を呼び出す
	if err != nil {
		return nil, fmt.Errorf("ロール名 %s の取得に失敗しました: %w", name, err)
	}
	return role, nil
}
