package admin

import (
	"modules/src/middleware"
	"modules/src/module"
	"modules/src/repository"

	"github.com/gin-gonic/gin"
)

type AdminRouter struct {
	handler  *AdminHandler
	userRepo repository.UserRepository
}

func NewAdminRoutes(handler *AdminHandler) module.Route {
	return &AdminRouter{
		handler:  handler,
		userRepo: handler.UserUC.UserRepo,
	}
}

func (r *AdminRouter) RegisterRoutes(engine *gin.Engine) {
	adminGroup := engine.Group("/admin")

	// 管理者ログイン（認証不要）
	adminGroup.POST("/login", r.handler.AdminLogin())

	// 管理者専用エンドポイント（認証必要）
	protected := adminGroup.Group("/")
	protected.Use(middleware.AdminAuthMiddleware(r.userRepo))
	{
		protected.POST("/movies", r.handler.CreateMovie())
		protected.POST("/screening-periods", r.handler.CreateScreeningPeriod())
		protected.POST("/screenings", r.handler.CreateScreening())
	}
}