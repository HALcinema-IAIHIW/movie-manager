package router

import (
	"modules/src/adapters/controller/movie"
	"modules/src/adapters/controller/screen"
	"modules/src/adapters/controller/screening"
	"modules/src/adapters/controller/seatType"
	"modules/src/adapters/controller/user"
	"modules/src/di"
	"modules/src/internal"
)

func InitRoutes(h *di.Handlers) []internal.Route {
	return []internal.Route{
		user.NewUserRoutes(h.User),
		movie.NewMovieRoutes(h.Movie),
		screen.NewScreenRoutes(h.Screen),
		seatType.NewSeatTypeRoutes(h.SeatType),
		screening.NewScreeningRoutes(h.Screening),
	}
}
