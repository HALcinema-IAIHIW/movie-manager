// adapters/controller/seat_type_handler.go
package handler

import (
	"modules/datastructure/request"
	"modules/datastructure/response"
	"modules/internal/seatType/usecase"
	"modules/module"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SeatTypeHandler struct {
	UC *usecase.SeatTypeUsecase
}

func NewSeatTypeHandler(uc *usecase.SeatTypeUsecase) *SeatTypeHandler {
	return &SeatTypeHandler{UC: uc}
}

func (h *SeatTypeHandler) Routes() module.Route {
	return NewSeatTypeRoutes(h)
}

func (h *SeatTypeHandler) CreateSeatType() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreateSeatTypeRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		seat, err := h.UC.CreateSeatType(req.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "SeatTypeの作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, response.CreateSeatTypeResponse{
			Message: "シートの種類を作成しました",
			ID:      seat.ID,
		})
	}
}
