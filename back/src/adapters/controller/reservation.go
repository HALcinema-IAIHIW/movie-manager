package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"modules/database/model"


// 座席予約の作成API
func CreateReservationSeat(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateReservationSeatRequest

		// JSONのバインド & バリデーション
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 関連するレコードの存在確認（任意）
		var user model.User
		if err := db.First(&user, req.UserID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定されたユーザーが存在しません"})
			return
		}

		var screening model.Screening
		if err := db.First(&screening, req.ScreeningID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定された上映が存在しません"})
			return
		}

		var seat model.Seat
		if err := db.First(&seat, req.SeatID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定された座席が存在しません"})
			return
		}

		var ticket model.Ticket
		if err := db.First(&ticket, req.TicketID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定されたチケットが存在しません"})
			return
		}

		var purchase model.Purchase
		if err := db.First(&purchase, req.PurchaseID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定された購入情報が存在しません"})
			return
		}

		// 重複予約チェック（ユニークインデックスに基づく）
		var existing model.ReservationSeat
		if err := db.Where("user_id = ? AND screening_id = ? AND seat_id = ?", req.UserID, req.ScreeningID, req.SeatID).First(&existing).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "この座席はすでに予約されています"})
			return
		}

		// 予約レコード作成
		reservation := model.ReservationSeat{
			UserID:      req.UserID,
			ScreeningID: req.ScreeningID,
			SeatID:      req.SeatID,
			TicketID:    req.TicketID,
			PurchaseID:  req.PurchaseID,
			IsCancelled: false,
			CancelledAt: nil,
		}

		if err := db.Create(&reservation).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "予約の作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "座席を予約しました",
			"id":      reservation.ID,
		})
	}
}
