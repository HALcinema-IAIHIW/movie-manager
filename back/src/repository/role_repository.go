package repository

import "modules/src/database/model"

type RoleRepository interface {
	Create(role *model.Role) error
	// GetFindRoll(role *model.Role) error
	GetByRoleName(name string) (*model.Role, error)
}
