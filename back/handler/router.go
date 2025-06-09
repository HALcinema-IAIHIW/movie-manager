package handler

import (
	"modules/database/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Todo: 今後修正します
func GetUsers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var users []model.User
		db.Find(&users)
		c.JSON(http.StatusOK, users)
	}
}

// Todo:ルートを共通化する movieはmoviehandlerに内包する感じ
func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/users", GetUsers(db))
	r.POST("/register", Register(db))
	r.POST("/movies", CreateMovie(db))
	r.GET("/movies", GetMovies(db))
	r.POST("/seat-type", CreateSeatType(db))
}
