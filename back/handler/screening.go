package handler

import (
	"net/http"
	"time"

	"modules/database/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateScreeningRequest struct {
	MovieId     uint      `json:"movie_id" binding:"required"`
	ScreenId    uint      `json:"screen_id" binding:"required"`
	StartTime   time.Time `json:"start_time" binding:"required"`
	Duration    int       `json:"duration" binding:"required,gte=1"`
	Language    string    `json:"language"`
	IsSubtitled bool      `json:"is_subtitled,omitempty"`
	IsDubbed    bool      `json:"is_dubbed,omitempty"`
	IsActive    bool      `json:"is_active,omitempty"`
	Status      string    `json:"status" binding:"required,oneof=scheduled cancelled delayed"`
}

func CreateScreening(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateScreeningRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 上映情報の作成
		screening := model.Screening{
			MovieID:     req.MovieId,
			ScreenID:    req.ScreenId,
			StartTime:   req.StartTime,
			Duration:    req.Duration,
			Language:    req.Language,
			IsSubtitled: req.IsSubtitled,
			IsDubbed:    req.IsDubbed,
			IsActive:    req.IsActive,
			Status:      req.Status,
		}

		if err := db.Create(&screening).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映情報の登録に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message":      "上映情報を登録しました",
			"screening_id": screening.ID,
		})
	}
}
