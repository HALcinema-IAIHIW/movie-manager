package handler

import (
	"modules/database/model"
	"modules/dto"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateMovie(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateMovieRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "入力形式が間違っています"})
			return
		}

		releaseDate, err := time.Parse("2006-01-02", req.ReleaseDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付の形式が不正です。YYYY-MM-DD形式で入力してください"})
			return
		}

		movie := model.Movie{
			Title:       req.Title,
			Description: req.Description,
			ReleaseDate: releaseDate,
			Genre:       req.Genre,
			Director:    req.Director,
		}

		if err := db.Create(&movie).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画登録に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "映画登録が完了しました"})
	}
}

func GetMovies(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var movies []model.Movie
		if err := db.Find(&movies).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "映画情報の取得に失敗しました"})
			return
		}
		c.JSON(http.StatusOK, movies)
	}
}
