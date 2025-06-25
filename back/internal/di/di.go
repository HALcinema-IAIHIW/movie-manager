package di

import (
	"gorm.io/gorm"

	// User
	userHandler "modules/internal/user/handler"
	userRepository "modules/internal/user/repository"
	userUsecase "modules/internal/user/usecase"

	// Movie
	movieHandler "modules/internal/movie/handler"
	movieRepository "modules/internal/movie/repository"
	movieUsecase "modules/internal/movie/usecase"

	// Screen
	screenHandler "modules/internal/screen/handler"
	screenRepository "modules/internal/screen/repository"
	screenUsecase "modules/internal/screen/usecase"

	// SeatType
	seatTypeHandler "modules/internal/seatType/handler"
	seatTypeRepository "modules/internal/seatType/repository"
	seatTypeUsecase "modules/internal/seatType/usecase"

	// Screening
	screeningHandler "modules/internal/screening/handler"
	screeningRepository "modules/internal/screening/repository"
	screeningUsecase "modules/internal/screening/usecase"
)

// Handlers struct holds all handler instances (acts as DI container)
type Handlers struct {
	User      *userHandler.UserHandler
	Movie     *movieHandler.MovieHandler
	Screen    *screenHandler.ScreenHandler
	SeatType  *seatTypeHandler.SeatTypeHandler
	Screening *screeningHandler.ScreeningHandler
	// Purchase *purchaseHandler.PurchaseHandler // Optional
}

// NewHandlers performs dependency injection for all layers and returns assembled handlers.
func NewHandlers(db *gorm.DB) *Handlers {
	// User
	userRepo := userRepository.NewGormUserRepository(db)
	userUC := &userUsecase.UserUsecase{UserRepo: userRepo}
	userH := userHandler.NewUserHandler(userUC)

	// Movie
	movieRepo := movieRepository.NewGormMovieRepository(db)
	movieUC := &movieUsecase.MovieUsecase{MovieRepo: movieRepo}
	movieH := movieHandler.NewMovieHandler(movieUC)

	// Screen
	screenRepo := screenRepository.NewGormScreenRepository(db)
	screenUC := screenUsecase.NewScreenUsecase(screenRepo)
	screenH := screenHandler.NewScreenHandler(screenUC)

	// SeatType
	seatTypeRepo := seatTypeRepository.NewGormSeatTypeRepository(db)
	seatTypeUC := &seatTypeUsecase.SeatTypeUsecase{SeatRepo: seatTypeRepo}
	seatTypeH := seatTypeHandler.NewSeatTypeHandler(seatTypeUC)

	// Screening
	screeningRepo := screeningRepository.NewGormScreeningRepository(db)
	screeningUC := &screeningUsecase.ScreeningUsecase{ScreeningRepo: screeningRepo}
	screeningH := screeningHandler.NewScreeningHandler(screeningUC)

	return &Handlers{
		User:      userH,
		Movie:     movieH,
		Screen:    screenH,
		SeatType:  seatTypeH,
		Screening: screeningH,
	}
}
