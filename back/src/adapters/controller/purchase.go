package controller

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"modules/src/database/model"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type PaymentStatus string

const (
	Pending PaymentStatus = "pending"
	Paid    PaymentStatus = "paid"
	Failed  PaymentStatus = "failed"
)

type CreatePurchaseRequest struct {
	UserID        uint          `json:"user_id" binding:"required"`
	ScreeningID   uint          `json:"screening_id" binding:"required"`
	TotalPrice    int           `json:"total_price" binding:"required,gte=0"`
	PaymentStatus PaymentStatus `json:"payment_status" binding:"required,oneof=pending paid failed"`
	PurchaseTime  string        `json:"purchase_time" binding:"required,datetime=2006-01-02T15:04:05Z07:00"` // ISO 8601 形式などを想定
}

func CreatePurchase(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreatePurchaseRequest
		// JSONリクエストボディを構造体にバインドし、バリデーションを実行
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		parsedTime, err := time.Parse("2006-01-02T15:04:05Z07:00", req.PurchaseTime)
		if err != nil {
			// パースに失敗した場合のエラーハンドリング
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to parse purchase time: %v", err)})
			return
		}

		// 新規スクリーン作成
		purchase := model.Purchase{
			UserID:        req.UserID,
			ScreeningID:   req.ScreeningID,
			TotalPrice:    req.TotalPrice,
			PaymentStatus: model.PaymentStatus(req.PaymentStatus),
			PurchaseTime:  parsedTime,
		}

		// データベースにスクリーン情報を保存
		if err := db.Create(&purchase).Error; err != nil {
			var pgErr *pq.Error

			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23505":
					c.JSON(http.StatusConflict, gin.H{"error": "入力された購入情報はすでに存在します"})
					return
				case "23503":
					c.JSON(http.StatusBadRequest, gin.H{"error": "関連するユーザーや上映情報が見つかりません（外部キーエラー）", "detail": pgErr.Detail})
					return
				default:
					// その他のPostgreSQLエラー
					c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("データベースエラーが発生しました（コード: %s）", pgErr.Code), "detail": pgErr.Detail, "message": pgErr.Message})
					return
				}
			}

			// その他のデータベースエラー
			c.JSON(http.StatusInternalServerError, gin.H{"error": "購入情報の登録に失敗しました", "detail": err.Error()})
			return
		}

		// 成功レスポンスを返す
		c.JSON(http.StatusCreated, gin.H{
			"message":    "購入情報が登録されました",
			"PurchaseID": purchase.ID,
		})
	}
}

func GetPurchase(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var purchases []model.Purchase

		if err := db.Find(&purchases).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusOK, []model.Purchase{}) // 200 OK と空の配列
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "購入情報の取得に失敗しました"})
			return
		}

		// 成功レスポンスを返す
		c.JSON(http.StatusOK, purchases) // 200 OK と取得したスクリーン一覧
	}
}
