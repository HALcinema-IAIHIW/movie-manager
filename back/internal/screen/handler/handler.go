package handler

import (
	"modules/database/model"
	"modules/datastructure/request"
	"modules/internal/screen"
	"modules/internal/screen/usecase"
	"modules/module"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ScreenHandler struct {
	Usecase *usecase.ScreenUsecase
}

func NewScreenHandler(uc *usecase.ScreenUsecase) *ScreenHandler {
	return &ScreenHandler{Usecase: uc}
}

func (h *ScreenHandler) Routes() module.Route {
	return NewScreenRoutes(h)
}

func (h *ScreenHandler) CreateScreen() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateScreenRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		MaxColumn, _ := strconv.Atoi(req.MaxColumn)
		screens := &model.Screen{
			MaxRow:    strconv.Itoa(req.MaxRow),
			MaxColumn: MaxColumn,
		}
		if err := h.Usecase.CreateScreen(screens); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーンの登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, screen.ToScreenResponse(*screens))
	}
}

func (h *ScreenHandler) GetScreens() gin.HandlerFunc {
	return func(c *gin.Context) {
		screens, err := h.Usecase.GetAllScreens()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "取得失敗"})
			return
		}
		c.JSON(http.StatusOK, screen.ToScreenResponseList(screens))
	}
}
