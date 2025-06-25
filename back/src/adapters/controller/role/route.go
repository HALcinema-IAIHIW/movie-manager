package role

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type RoleRouter struct {
	handler *RoleHandler
}

func NewRoleRoutes(handler *RoleHandler) module.Route {
	return &RoleRouter{handler: handler}
}
func (r *RoleRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/roles")
	group.POST("/", r.handler.CreateRoles())
	group.GET("/", r.handler.GetRoles())
}
