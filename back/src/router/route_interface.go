package router

import "github.com/gin-gonic/gin"

type Route interface {
	RegisterRoutes(r *gin.Engine)
}
