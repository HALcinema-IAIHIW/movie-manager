package router

import (
	"modules/handler"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pomg"})
	})

	// r.GET("/users", handler.GetUsers(db))
	// r.POST("/register", handler.Register(db))

	handler.CreateUserRequest(r, db)
	return r
}
