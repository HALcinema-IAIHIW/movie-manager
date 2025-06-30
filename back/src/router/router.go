package router

import (
	"modules/src/di"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter(h *di.Handlers) *gin.Engine {
	r := gin.Default()

	// CORS許可

	// 公式CORSミドルウェア(go get github.com/gin-contrib/cors)があるとのこと
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "Get, Post, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // 204で即レス（プリフライト用）
			return
		}
		c.Next()
	})

	routes := InitRoutes(h)

	for _, route := range routes {
		route.RegisterRoutes(r)
	}

	r.GET("api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	return r
}
