package screen

import (
	"github.com/gin-gonic/gin"
)

func RegisterScreenRoutes(r *gin.RouterGroup, handler *ScreenHandler) {
	r.POST("/", handler.CreateScreen())
	r.GET("/", handler.GetScreens())
}
