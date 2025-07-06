package di

import (
	"modules/src/adapters/controller/movie"
	"modules/src/adapters/controller/period"
	"modules/src/adapters/controller/purchase"
	"modules/src/adapters/controller/reservationseat"
	"modules/src/adapters/controller/role"
	"modules/src/adapters/controller/screen"
	"modules/src/adapters/controller/screening"
	"modules/src/adapters/controller/seat"
	"modules/src/adapters/controller/user"
	"modules/src/adapters/gateway"
	"modules/src/repository"
	"modules/src/usecases"

	"gorm.io/gorm"
)

type Handlers struct {
	User            *user.UserHandler
	Movie           *movie.MovieHandler
	Screen          *screen.ScreenHandler
	Seat            *seat.SeatHandler
	Screening       *screening.ScreeningHandler
	Role            *role.RoleHandler
	Period          *period.PeriodHandler
	Purchase        *purchase.PurchaseHandler
	ReservationSeat *reservationseat.ReservationSeatHandler
}

func NewHandlers(db *gorm.DB) *Handlers {

	// role r
	roleRepo := gateway.NewGormRoleRepository(db)
	roleUC := &usecases.RoleUsecase{RoleRepo: roleRepo}
	roleHandler := role.NewRoleHandler(roleUC)

	// User
	userRepo := gateway.NewGormUserRepository(db)
	userUC := &usecases.UserUsecase{UserRepo: userRepo, RoleRepo: roleRepo}
	userHandler := user.NewUserHandler(userUC)

	// Movie
	movieRepo := gateway.NewGormMovieRepository(db)
	movieUC := &usecases.MovieUsecase{MovieRepo: movieRepo}
	movieHandler := movie.NewMovieHandler(movieUC)

	// Screen
	screenRepo := gateway.NewGormScreenRepository(db)
	screenUC := &usecases.ScreenUsecase{ScreenRepo: screenRepo}
	screenHandler := screen.NewScreenHandler(screenUC)

	//Seat
	seatRepo := gateway.NewGormSeatRepository(db)
	seatUC := &usecases.SeatUsecase{SeatRepo: seatRepo}
	seatHandler := seat.NewSeatHandler(seatUC)

	// screening
	screeningRepo := gateway.NewGormScreeningRepository(db)
	screeningUC := &usecases.ScreeningUsecase{ScreeningRepo: screeningRepo}
	screeningHandler := screening.NewScreeningHandler(screeningUC)

	// Period
	periodRepo := gateway.NewGormPeriodRepository(db)
	periodUC := &usecases.PeriodUsecase{PeriodRepo: periodRepo}
	periodHandler := period.NewPeriodHandler(periodUC)

	// Purchase
	purchaseRepo := repository.NewGormPurchaseRepository(db)
	purchaseUsecase := usecases.NewPurchaseUsecase(purchaseRepo, screeningRepo, seatRepo, roleRepo)
	purchaseHandler := purchase.NewPurchaseHandler(purchaseUsecase)

	// ReservationSeat
	reservationseatRepo := repository.NewGormReservationSeatRepository(db)
	reservationseatUsecase := usecases.NewReservationSeatUsecase(reservationseatRepo)
	reservationseatHandler := reservationseat.NewReservationSeatHandler(reservationseatUsecase)

	return &Handlers{
		User:            userHandler,
		Movie:           movieHandler,
		Screen:          screenHandler,
		Seat:            seatHandler,
		Screening:       screeningHandler,
		Role:            roleHandler,
		Purchase:        purchaseHandler,
		Period:          periodHandler,
		ReservationSeat: reservationseatHandler,
	}
}
