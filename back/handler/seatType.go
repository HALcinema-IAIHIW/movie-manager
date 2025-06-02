package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"modules/database/model"
	"modules/dto"
)

func CreateSeatType(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateSeatTypeRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		seat := model.SeatType{
			Name: req.Name,
		}

		if err := db.Create(&seat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "SeatTypeをデータベース登録失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "シートの種類を作成しました", "id": seat.ID})
	}
}
