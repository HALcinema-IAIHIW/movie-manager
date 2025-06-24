package screen

import (
	"github.com/gin-gonic/gin"
)

type ScreenRouter struct {
	handler *ScreenHandler
}

func NewScreenRoutes(handler *ScreenHandler) *ScreenRouter {
	return &ScreenRouter{handler: handler}
}
func (r *ScreenRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("screens")
	group.POST("/", r.handler.CreateScreen())
	group.GET("/", r.handler.GetScreens())
}
