package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToRoleResponse(role *model.Role) *response.RoleResponse {
	if role == nil {
		return nil
	}
	return &response.RoleResponse{
		ID:       role.ID,
		RoleName: role.RoleName,
		PriceYen: role.PriceYen,
	}
}

func ToRoleResponseList(roles []model.Role) []response.RoleResponse {
	if roles == nil {
		return []response.RoleResponse{}
	}
	var roleResponses []response.RoleResponse
	for i := range roles {
		roleResponses = append(roleResponses, *ToRoleResponse(&roles[i])) // ToRoleResponse にポインタを渡す
	}
	return roleResponses
}
