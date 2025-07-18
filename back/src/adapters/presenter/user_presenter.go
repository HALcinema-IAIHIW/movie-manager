package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToUserResponseList(users []model.User) []response.UserResponse {
	res := make([]response.UserResponse, 0, len(users))
	for _, u := range users {
		res = append(res, response.UserResponse{
			ID:       u.ID,
			Name:     u.Name,
			Email:    u.Email,
			RoleName: u.Role.RoleName,
		})
	}
	return res
}

func ToUserResponse(user *model.User) response.UserResponse {
	return response.UserResponse{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		RoleName: user.Role.RoleName,
	}
}
