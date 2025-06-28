package period

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type Period struct {
	handler *ScreenPeriodHandler
}

func NewScreenPeriodRoutes(handler *ScreenPeriodHandler) module.Route {
	return &Period{handler: handler}
}

func (r *Period) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("period")
	group.POST("/", r.handler.CreatePeriod())
}
