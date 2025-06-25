package presenter

import (
	"modules/src/database/model"
	"modules/src/datastructure/response"
)

func ToScreenResponse(screen model.Screen) response.ScreenResponse {
	return response.ScreenResponse{
		ID: screen.ID,
		// MaxRow:    screen.MaxRow,
		// MaxColumn: screen.MaxColumn,
	}
}

func ToScreenResponseList(screens []model.Screen) []response.ScreenResponse {
	var res []response.ScreenResponse
	for _, s := range screens {
		res = append(res, ToScreenResponse(s))
	}
	return res
}
