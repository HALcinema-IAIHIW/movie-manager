package movie

import (
	"github.com/gin-gonic/gin"
)

type MovieRouter struct {
	handler *MovieHandler
}

func NewMovieRoutes(handler *MovieHandler) *MovieRouter {
	return &MovieRouter{handler: handler}
}
func (r *MovieRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/movies")
	group.POST("/", r.handler.CreateMovie())
	group.GET("/", r.handler.GetMovies())
}
