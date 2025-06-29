package seat

import (
	"github.com/gin-gonic/gin"
)

// SeatRoutes は座席に関するルートを定義します
type SeatRoutes struct {
	Handler *SeatHandler
}

func NewSeatRoutes(handler *SeatHandler) *SeatRoutes {
	return &SeatRoutes{Handler: handler}
}

func (r *SeatRoutes) RegisterRoutes(engine *gin.Engine) {
	seatGroup := engine.Group("/seats")
	{
		seatGroup.POST("/", r.Handler.CreateSeat())
		seatGroup.GET("/", r.Handler.GetSeats())
	}
}
