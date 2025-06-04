package handler

import (
	"modules/database/model"
	"net/http"
	"time"

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

type GetScreeningsRequest struct {
	MovieId   uint       `form:"movie_id"`
	ScreenId  uint       `form:"screen_id"`
	StartTime *time.Time `form:"start_time" time_format:"2006-01-02T15:04:05Z07:00"`
	Status    string     `form:"status"`
	IsActive  *bool      `form:"is_active"`
}

func GetScreenings(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req GetScreeningsRequest
		if err := c.ShouldBindQuery(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var screenings []model.Screening
		query := db

		// クエリパラメータに基づいてフィルタリング条件を追加
		if req.MovieId > 0 {
			query = query.Where("movie_id = ?", req.MovieId)
		}
		if req.ScreenId > 0 {
			query = query.Where("screen_id = ?", req.ScreenId)
		}
		if req.StartTime != nil && !req.StartTime.IsZero() {
			query = query.Where("start_time >= ? AND start_time < ?", req.StartTime, req.StartTime.Add(24*time.Hour))
		}
		if req.Status != "" {
			query = query.Where("status = ?", req.Status)
		}
		if req.IsActive != nil {
			query = query.Where("is_active = ?", *req.IsActive)
		}

		// データベースから上映情報を取得
		if err := query.Find(&screenings).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusOK, []model.Screening{})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "上映情報の取得に失敗しました"})
			return
		}

		// 成功レスポンスを返す
		c.JSON(http.StatusOK, screenings)
	}
}
