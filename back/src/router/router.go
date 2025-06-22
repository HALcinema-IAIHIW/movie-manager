package router

import (
	"modules/src/adapters/controller"
	"modules/src/di"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter(h *di.Handlers) *gin.Engine {
	r := gin.Default()

	controller.RegisterRoutes(r, h.User)

	// CORS許可
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "Get, Post, OPTIONS")
		c.Next()
	})

	r.GET("api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return r
}
