package handler

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/users", GetUsers(db))
	r.POST("/users", CreateUser(db))
	r.PUT("/users/:id", UpdateUser(db))
	r.POST("/movies", CreateMovie(db))
	r.GET("/movies", GetMovies(db))
	r.POST("/seat-type", CreateSeatType(db))
	r.POST("/screenings", CreateScreening(db))
	r.GET("/screenings", GetScreenings(db))
	r.POST("/screens", CreateScreen(db))
	r.GET("/screens", GetScreens(db))
	r.POST("/purchases", CreatePurchase(db))
	r.GET("/purchases", GetPurchase(db))
	r.POST("/tickets", CreateTicket(db))
	r.GET("/tickets", GetTicket(db))
	r.POST("/seats", CreateSeat(db))
	r.GET("/seats", GetSeat(db))
}
