package seatType

import (
	"github.com/gin-gonic/gin"
)

type SeatTypeRouter struct {
	handler *SeatTypeHandler
}

func NewSeatTypeRoutes(handler *SeatTypeHandler) *SeatTypeRouter {
	return &SeatTypeRouter{handler: handler}
}

func (r *SeatTypeRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/seat-types")
	group.POST("/", r.handler.CreateSeatType())
}
