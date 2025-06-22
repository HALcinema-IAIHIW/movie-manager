package di

import (
	"modules/src/adapters/controller/movie"
	"modules/src/adapters/controller/screen"

	// "modules/src/adapters/controller/purchase"
	"modules/src/adapters/controller/user"
	"modules/src/adapters/gateway"
	"modules/src/usecases"

	"gorm.io/gorm"
)

type Handlers struct {
	User   *user.UserHandler
	Movie  *movie.MovieHandler
	Screen *screen.ScreenHandler
	// Purchase *purchase.PurchaseHandler
}

func NewHandlers(db *gorm.DB) *Handlers {
	// User
	userRepo := gateway.NewGormUserRepository(db)
	userUC := &usecases.UserUsecase{UserRepo: userRepo}
	userHandler := user.NewUserHandler(userUC)

	// Movie
	movieRepo := gateway.NewGormMovieRepository(db)
	movieUC := &usecases.MovieUsecase{MovieRepo: movieRepo}
	movieHandler := movie.NewMovieHandler(movieUC)

	// Screen
	screenRepo := gateway.NewGormScreenRepository(db)
	screenUC := &usecases.ScreenUsecase{ScreenRepo: screenRepo}
	screenHandler := screen.NewScreenHandler(screenUC)

	// // Purchase
	// purchaseRepo := gateway.NewGormPurchaseRepository(db)
	// purchaseUC := &usecases.PurchaseUsecase{Repo: purchaseRepo}
	// purchaseHandler := purchase.NewPurchaseHandler(purchaseUC)

	return &Handlers{
		User:   userHandler,
		Movie:  movieHandler,
		Screen: screenHandler,
		// Purchase: purchaseHandler,
	}
}
