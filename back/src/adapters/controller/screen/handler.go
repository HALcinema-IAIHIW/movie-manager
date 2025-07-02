package screen

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ScreenHandler struct {
	Usecase *usecases.ScreenUsecase
}

func NewScreenHandler(uc *usecases.ScreenUsecase) *ScreenHandler {
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
		screen := &model.Screen{
			MaxRow:    req.MaxRow,
			MaxColumn: req.MaxColumn,
		}
		if err := h.Usecase.CreateScreen(screen); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーンの登録に失敗しました"})
			return
		}
		c.JSON(http.StatusCreated, presenter.ToScreenResponse(*screen))
	}
}

func (h *ScreenHandler) GetScreens() gin.HandlerFunc {
	return func(c *gin.Context) {
		screens, err := h.Usecase.GetAllScreens()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "取得失敗"})
			return
		}
		c.JSON(http.StatusOK, presenter.ToScreenResponseList(screens))
	}
}

func (h *ScreenHandler) GetScreenByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDは数値で指定してください"})
			return
		}

		screen, err := h.Usecase.GetScreenByID(uint(id))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーン取得中にエラーが発生しました"})
			return
		}
		if screen == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "スクリーンが見つかりません"})
			return
		}

		res := presenter.ToScreenResponse(*screen)

		c.JSON(http.StatusOK, res)
	}
}
