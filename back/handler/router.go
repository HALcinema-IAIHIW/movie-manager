package handler

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/users", GetUsers(db))
	r.POST("/register", Register(db))
	r.POST("/movies", CreateMovie(db))
	r.GET("/movies", GetMovies(db))
	r.POST("/seattype", CreateSeatType(db))
}
