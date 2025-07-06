package purchase

import (
	"github.com/gin-gonic/gin"
)

type PurchaseRouter struct {
	handler *PurchaseHandler
}

func NewPurchaseRouter(handler *PurchaseHandler) *PurchaseRouter {
	return &PurchaseRouter{handler: handler}
}

func (r *PurchaseRouter) RegisterRoutes(engine *gin.Engine) {
	purchaseGroup := engine.Group("/purchases")
	{
		purchaseGroup.GET("reservations/:userID", r.handler.GetUserReservations())

		purchaseGroup.GET("/:id", r.handler.GetPurchaseByID())
		purchaseGroup.POST("/", r.handler.CreatePurchase())
		purchaseGroup.GET("/", r.handler.GetAllPurchases())
	}
}
