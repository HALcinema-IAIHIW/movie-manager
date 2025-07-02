package screening

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type ScreeningRouter struct {
	handler *ScreeningHandler
}

func NewScreeningRoutes(handler *ScreeningHandler) module.Route {
	return &ScreeningRouter{handler: handler}
}

func (r *ScreeningRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/screenings")
	group.POST("", r.handler.CreateScreening())
	group.GET("", r.handler.GetScreeningsByDate()) // フロント側でのスケジュールで使用しています
	group.GET("/:id", r.handler.GetScreeningByID())
}
