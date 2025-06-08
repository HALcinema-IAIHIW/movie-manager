package handler

import (
	"net/http"

	"modules/database/model"
	"modules/dto"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateTicket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateTicketRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "入力が正しくありません: " + err.Error(),
			})
			return
		}

		ticket := model.Ticket{
			Type:     req.Type,
			PriceYen: req.PriceYen,
		}

		if err := db.Create(&ticket).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "チケットの作成に失敗しました",
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "チケットを作成しました",
			"ticket":  ticket,
		})
	}
}
