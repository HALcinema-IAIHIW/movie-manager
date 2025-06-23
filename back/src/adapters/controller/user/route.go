package user

import (
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(r *gin.RouterGroup, handler *UserHandler) {
	r.POST("/", handler.CreateUser())
	r.GET("/", handler.GetUser())
	r.GET("/:id", handler.GetUserByID())
}
