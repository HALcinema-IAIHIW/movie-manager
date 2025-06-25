package screen

import (
	"modules/database/model"
	"modules/datastructure/response"
	"strconv"
)

func ToScreenResponse(screen model.Screen) response.ScreenResponse {
	MaxRow, err := strconv.Atoi(screen.MaxRow)
	if err != nil {
	}
	return response.ScreenResponse{
		ID:        screen.ID,
		MaxRow:    MaxRow,
		MaxColumn: strconv.Itoa(screen.MaxColumn),
	}
}

func ToScreenResponseList(screens []model.Screen) []response.ScreenResponse {
	var res []response.ScreenResponse
	for _, s := range screens {
		res = append(res, ToScreenResponse(s))
	}
	return res
}
