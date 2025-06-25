package handler

import (
	"github.com/gin-gonic/gin"
	"modules/module"
)

type SeatTypeRouter struct {
	handler *SeatTypeHandler
}

func NewSeatTypeRoutes(handler *SeatTypeHandler) module.Route {
	return &SeatTypeRouter{handler: handler}
}

func (r *SeatTypeRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/seat-types")
	group.POST("/", r.handler.CreateSeatType())
}
