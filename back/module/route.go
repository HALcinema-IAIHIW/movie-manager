package module

import "github.com/gin-gonic/gin"

type Route interface {
	RegisterRoutes(engin *gin.Engine)
}

type RouteProvider interface {
	Routes() Route
}
