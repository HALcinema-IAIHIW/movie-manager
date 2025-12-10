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
	SeatUC  *usecases.SeatUsecase
}

func NewScreenHandler(uc *usecases.ScreenUsecase, seatUC *usecases.SeatUsecase) *ScreenHandler {
	return &ScreenHandler{Usecase: uc, SeatUC: seatUC}
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

		// スクリーン作成直後に座席を自動生成
		createdSeats, err := h.SeatUC.GenerateSeatsByScreenID(screen.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の自動生成に失敗しました", "details": err.Error()})
			return
		}

		res := presenter.ToScreenResponse(*screen)
		c.JSON(http.StatusCreated, gin.H{
			"screen":        res,
			"created_seats": createdSeats,
		})
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
