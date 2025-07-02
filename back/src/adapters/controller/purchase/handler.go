package purchase

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"modules/src/adapters/presenter"
	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/module"
	"modules/src/usecases"

	"github.com/gin-gonic/gin"
)

type PurchaseHandler struct {
	Usecase *usecases.PurchaseUsecase
}

func NewPurchaseHandler(uc *usecases.PurchaseUsecase) *PurchaseHandler {
	return &PurchaseHandler{Usecase: uc}
}

func (h *PurchaseHandler) Routes() module.Route {
	return NewPurchaseRoutes(h)
}

func (h *PurchaseHandler) CreatePurchase() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req request.CreatePurchaseRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "入力形式が間違っています", "details": err.Error()})
			return
		}

		parsedTime, err := time.Parse("2006-01-02T15:04:05Z07:00", req.PurchaseTime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "購入日時の形式が正しくありません (ISO 8601形式: YYYY-MM-DDTHH:MM:SSZ±HH:MM)", "details": err.Error()})
			return
		}

		purchase := &model.Purchase{
			UserID:       req.UserID,
			ScreeningID:  req.ScreeningID,
			PurchaseTime: parsedTime,
		}

		if err := h.Usecase.CreatePurchase(purchase, req.PurchaseDetails); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("💰 購入が登録されました: %+v\n", purchase)

		c.JSON(http.StatusCreated, gin.H{
			"message":    "購入情報が登録されました",
			"PurchaseID": purchase.ID,
			"TotalPrice": purchase.TotalPrice,
		})
	}
}

func (h *PurchaseHandler) GetPurchases() gin.HandlerFunc {
	return func(c *gin.Context) {
		purchases, err := h.Usecase.GetAllPurchases()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "購入情報の取得に失敗しました", "details": err.Error()})
			return
		}

		res := presenter.ToPurchaseResponseList(purchases)

		c.JSON(http.StatusOK, res)
	}
}

func (h *PurchaseHandler) GetPurchaseById() gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("purchase_id")
		idUint64, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "IDが不正です", "details": err.Error()})
			return
		}
		id := uint(idUint64)

		purchase, err := h.Usecase.GetPurchaseByID(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "購入情報の取得に失敗しました", "details": err.Error()})
			return
		}
		if purchase == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "指定された購入情報が見つかりません"})
			return
		}

		res := presenter.ToPurchaseResponse(*purchase)
		
		c.JSON(http.StatusOK, res)
	}
}
