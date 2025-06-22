package controller

import (
	"modules/src/adapters/controller/movie"
	"modules/src/adapters/controller/screen"
	"modules/src/adapters/controller/user"

	"github.com/gin-gonic/gin"
)

// // Todo: 今後修正します
// func GetUsers(db *gorm.DB) gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var users []model.User
// 		db.Find(&users)
// 		c.JSON(http.StatusOK, users)
// 	}
// }

// Todo:ルートを共通化する movieはmoviehandlerに内包する感じ
func RegisterRoutes(r *gin.Engine,
	userHandler *user.UserHandler,
	movieHandler *movie.MovieHandler,
	screenHandler *screen.ScreenHandler,
) {
	user.RegisterUserRoutes(r.Group("/users"), userHandler)
	movie.RegisterMovieRoutes(r.Group("/movies"), movieHandler)
	screen.RegisterScreenRoutes(r.Group("/screens"), screenHandler)
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
