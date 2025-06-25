package usecases

import (
	"modules/src/database/model"
)

type RoleUsecase struct {
	RoleRepo RoleRepository
}

type RoleRepository interface {
	Create(role *model.Role) error
	GetFindAll(role *[]model.Role) error
}

func (u *RoleUsecase) CreateRole(role *model.Role) error {
	return u.RoleRepo.Create(role)
}

func (u *RoleUsecase) GetAllRoles() ([]model.Role, error) {
	var roles []model.Role
	err := u.RoleRepo.GetFindAll(&roles)
	return roles, err
}
