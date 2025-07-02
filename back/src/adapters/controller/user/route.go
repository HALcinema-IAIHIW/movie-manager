package user

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type UserRouter struct {
	handler *UserHandler
}

func NewUserRoutes(handler *UserHandler) module.Route {
	return &UserRouter{handler: handler}
}

func (r *UserRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/users")
	group.POST("/", r.handler.CreateUser())

	// 登録している全ユーザー取得(確認用)
	group.GET("/", r.handler.GetAllUsers())
	// ユーザー単体の取得
	group.GET("/:id", r.handler.GetUserByID())
}
