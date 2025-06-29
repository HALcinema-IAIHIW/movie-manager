package seat

import (
	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SeatHandler は座席関連のHTTPリクエストを処理します
type SeatHandler struct {
	Usecase *usecases.SeatUsecase
}

// NewSeatHandler は新しいSeatHandlerのインスタンスを作成します
func NewSeatHandler(uc *usecases.SeatUsecase) *SeatHandler {
	return &SeatHandler{Usecase: uc}
}

func (h *SeatHandler) Routes() module.Route {
	return NewSeatRoutes(h)
}

func (h *SeatHandler) CreateSeat() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateSeatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		seat := &model.Seat{
			ScreenID:   req.ScreenID,
			Row:        req.Row,
			Column:     req.Column,
			SeatTypeID: req.SeatTypeID,
		}
		err := h.Usecase.CreateSeat(seat)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の登録に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, presenter.ToSeatResponse(*seat))
	}
}

// GetSeats はすべての座席を取得するためのハンドラです
func (h *SeatHandler) GetSeats() gin.HandlerFunc {
	return func(c *gin.Context) {
		seats, err := h.Usecase.GetAllSeats()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の取得に失敗しました"})
			return
		}
		c.JSON(http.StatusOK, presenter.ToSeatResponseList(seats))
	}
}
