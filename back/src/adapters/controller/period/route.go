package period

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type PeriodRouter struct {
	handler *PeriodHandler
}

func NewPeriodRoutes(handler *PeriodHandler) module.Route {
	return &PeriodRouter{handler: handler}
}

func (r *PeriodRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/periods")
	group.POST("/", r.handler.CreatePeriod())
	group.GET("/", r.handler.GetPeriod())
	group.GET("/date", r.handler.GetPeriodsByDate())
