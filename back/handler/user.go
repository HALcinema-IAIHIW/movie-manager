package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"modules/database/model"
	"modules/dto"
)

func CreateUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req dto.CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		email := strings.ToLower(req.Email)

		var existingUser model.User
		if err := db.Where("email = ?", email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "このメールアドレスは既に登録されています"})
			return
		} else if err != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "データベースエラー"})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "パスワードのハッシュ化に失敗しました"})
			return
		}

		user := model.User{
			Name:     req.Name,
			Email:    email,
			Password: string(hashedPassword),
			Role:     "user",
		}

		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "ユーザー登録が完了しました",
			"user_id": user.ID,
		})
	}
}
