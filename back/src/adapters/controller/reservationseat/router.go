package reservationseat

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type ReservationSeatRouter struct {
	handler *ReservationSeatHandler // 新しいハンドラーを使用
}

func NewReservationSeatRouter(handler *ReservationSeatHandler) module.Route {
	return &ReservationSeatRouter{handler: handler}
}

// Ginエンジンにルートを登録
func (r *ReservationSeatRouter) RegisterRoutes(engine *gin.Engine) {
	reservationSeatGroup := engine.Group("/reservationseats")
	{
		reservationSeatGroup.POST("/", r.handler.CreateReservationSeat())
		reservationSeatGroup.GET("/", r.handler.GetAllReservationSeats())
	}
}
