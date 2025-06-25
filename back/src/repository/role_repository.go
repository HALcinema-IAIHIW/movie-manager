package repository

import "modules/src/database/model"

type RoleRepository interface {
	Create(role *model.Movie) error
	GetFindRoll(role *model.Role) error
}
