package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToRoleResponse(role model.Role) response.RoleResponse {
	return response.RoleResponse{
		ID:       role.ID,
		RoleName: role.RoleName,
		PriceYen: role.PriceYen,
	}
}

func ToRoleResponseList(movies []model.Role) []response.RoleResponse {
	var res []response.RoleResponse
	for _, m := range movies {
		res = append(res, ToRoleResponse(m))
	}
	return res
}
