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
		seatGroup.POST("/", r.Handler.CreateSeat())
		seatGroup.GET("/", r.Handler.GetSeats())
		seatGroup.GET("/:screen_id", r.Handler.GetSeatsByScreenID())
	}
}
