package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"modules/database/model"
	"modules/dto"
)

func CreateSeat(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateSeatRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var screen model.Screen
		if err := db.First(&screen, req.ScreenID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定されたスクリーンが存在しません"})
			return
		}

		var seatType model.SeatType
		if err := db.First(&seatType, req.SeatTypeID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "指定されたシートタイプが存在しません"})
			return
		}

		var existing model.Seat
		if err := db.Where("screen_id = ? AND row = ? AND column = ?", req.ScreenID, req.Row, req.Column).First(&existing).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "このスクリーンにはすでに同じ位置の座席が存在します"})
			return
		}

		seat := model.Seat{
			ScreenID:   req.ScreenID,
			Row:        req.Row,
			Column:     req.Column,
			SeatTypeID: req.SeatTypeID,
		}

		if err := db.Create(&seat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席の作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "座席を作成しました",
			"id":      seat.ID,
		})
	}
}

func GetSeat(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var seats []model.Seat

		if err := db.Preload("Screen").Preload("SeatType").Find(&seats).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "座席情報の取得に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, seats)
	}
}
