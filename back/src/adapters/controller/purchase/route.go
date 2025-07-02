package purchase

import (
	"modules/src/module"

	"github.com/gin-gonic/gin"
)

type purchaseRoutes struct {
	handler *PurchaseHandler
}

func NewPurchaseRoutes(handler *PurchaseHandler) module.Route {
	return &purchaseRoutes{handler: handler}
}

func (r *purchaseRoutes) RegisterRoutes(engine *gin.Engine) {
	purchaseRoutes := engine.Group("/purchases")
	{
		purchaseRoutes.POST("/", r.handler.CreatePurchase())
		purchaseRoutes.GET("/", r.handler.GetPurchases())
		purchaseRoutes.GET("/:purchase_id", r.handler.GetPurchaseById())
	}
}
