package movie

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type MovieRouter struct {
	handler *MovieHandler
}

func NewMovieRoutes(handler *MovieHandler) module.Route {
	return &MovieRouter{handler: handler}
}
func (r *MovieRouter) RegisterRoutes(engine *gin.Engine) {
	group := engine.Group("/movies")
	group.POST("/", r.handler.CreateMovie())
	group.GET("/", r.handler.GetMovies())
	group.GET("/:movie_id", r.handler.GetMovieById())
}
