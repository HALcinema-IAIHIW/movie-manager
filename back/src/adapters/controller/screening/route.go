package screening

import (
	"github.com/gin-gonic/gin"
	"modules/src/module"
)

type ScreeningRouter struct {
	handler *ScreeningHandler
}

func NewScreeningRoutes(handler *ScreeningHandler) module.Route {
	return &ScreeningRouter{handler: handler}
}

func (r *ScreeningRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/screenings")
	group.POST("/", r.handler.CreateScreening())
	group.GET("/", r.handler.GetScreeningsByDate())
}
