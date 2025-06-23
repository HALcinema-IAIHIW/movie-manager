package movie

import (
	"github.com/gin-gonic/gin"
)

func RegisterMovieRoutes(r *gin.RouterGroup, handler *MovieHandler) {
	r.POST("/", handler.CreateMovie())
	r.GET("/", handler.GetMovies())
}
