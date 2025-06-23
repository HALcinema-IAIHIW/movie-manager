package controller

import (
	"modules/src/adapters/controller/movie"
	"modules/src/adapters/controller/screen"
	"modules/src/adapters/controller/screening"
	"modules/src/adapters/controller/seatType"
	"modules/src/adapters/controller/user"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	userHandler *user.UserHandler,
	movieHandler *movie.MovieHandler,
	screenHandler *screen.ScreenHandler,
	seatTypeHandler *seatType.SeatTypeHandler,
	screeningHandler *screening.ScreeningHandler,
) {
	user.RegisterUserRoutes(r.Group("/users"), userHandler)
	movie.RegisterMovieRoutes(r.Group("/movies"), movieHandler)
	screen.RegisterScreenRoutes(r.Group("/screens"), screenHandler)
	seatType.RegisterSeatTypeRoutes(r.Group("/seat-types"), seatTypeHandler)
	screening.RegisterScreeningRoutes(r.Group("/screenings"), screeningHandler)

	// r.POST("/", CreateUser(db))
	// r.POST("/movies", CreateMovie(db))
	// r.GET("/movies", GetMovies(db))
	// r.POST("/seat-type", CreateSeatType(db))
	// r.POST("/screenings", CreateScreening(db))
	// r.GET("/screenings", GetScreenings(db))
	// r.POST("/screens", CreateScreen(db))
	// r.GET("/screens", GetScreens(db))
	// r.POST("/purchases", CreatePurchase(db))
	// r.GET("/purchases", GetPurchase(db))
}
