package screening

import (
	"github.com/gin-gonic/gin"
)

func RegisterScreeningRoutes(r *gin.RouterGroup, handler *ScreeningHandler) {
	r.POST("/", handler.CreateScreening())
	r.GET("/", handler.GetScreeningsByDate())
}
