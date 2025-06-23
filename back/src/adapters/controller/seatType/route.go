package seatType

import (
	"github.com/gin-gonic/gin"
)

func RegisterSeatTypeRoutes(r *gin.RouterGroup, handler *SeatTypeHandler) {
	r.POST("/", handler.CreateSeatType())
}
