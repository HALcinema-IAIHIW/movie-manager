package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
	"modules/database/model"
)

type CreateScreenRequest struct {
	MaxRow    int    `json:"max_row" binding:"required,gte=1"`     // 最大行数 (必須, 1以上)
	MaxColumn string `json:"max_column" binding:"required,max=10"` // 最大列 (必須, 最大10文字を想定)
}

func CreateScreen(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateScreenRequest
		// JSONリクエストボディを構造体にバインドし、バリデーションを実行
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 新規スクリーン作成
		screen := model.Screen{
			MaxRow:    req.MaxRow,
			MaxColumn: req.MaxColumn,
		}

		// データベースにスクリーン情報を保存
		if err := db.Create(&screen).Error; err != nil {
			var pgErr *pq.Error

			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				c.JSON(http.StatusConflict, gin.H{"error": "指定されたMaxRowとMaxColumnの組み合わせはすでに存在します"})
				return
			}

			// その他のデータベースエラー
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーンの登録に失敗しました"})
			return
		}

		// 成功レスポンスを返す
		c.JSON(http.StatusCreated, gin.H{
			"message":   "スクリーンが登録されました",
			"screen_id": screen.ID,
		})
	}
}

func GetScreens(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var screens []model.Screen
		// データベースから全てのスクリーン情報を取得
		if err := db.Find(&screens).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusOK, []model.Screen{}) // 200 OK と空の配列
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "スクリーン情報の取得に失敗しました"})
			return
		}

		// 成功レスポンスを返す
		c.JSON(http.StatusOK, screens) // 200 OK と取得したスクリーン一覧
	}
}
