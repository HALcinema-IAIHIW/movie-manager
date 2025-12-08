package seat

import (
	"github.com/gin-gonic/gin"
)

type SeatRoutes struct {
	Handler *SeatHandler
}

func NewSeatRoutes(handler *SeatHandler) *SeatRoutes {
	return &SeatRoutes{Handler: handler}
}

func (r *SeatRoutes) RegisterRoutes(engine *gin.Engine) {
	seatGroup := engine.Group("/seats")
	{
		seatGroup.GET("/find/:screen_id/:seatIdStr", r.Handler.GetSeatByRowColumnScreenID())
		seatGroup.POST("/", r.Handler.CreateSeat())
		seatGroup.POST("/generate/:screen_id", r.Handler.GenerateSeats())
		seatGroup.GET("/", r.Handler.GetSeats())
		seatGroup.GET("/by-screen/:screen_id", r.Handler.GetSeatsByScreenID())
	}
}
