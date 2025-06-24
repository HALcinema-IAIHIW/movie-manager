package user

import "github.com/gin-gonic/gin"

type UserRouter struct {
	handler *UserHandler
}

func NewUserRoutes(handler *UserHandler) *UserRouter {
	return &UserRouter{handler: handler}
}

func (r *UserRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/users")
	group.POST("/", r.handler.CreateUser())
	group.GET("/", r.handler.GetUser())
	group.GET("/:id", r.handler.GetUserByID())
}
