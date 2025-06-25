package controller

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"modules/database/model"
)

func UpdateUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		idStr := c.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ユーザーIDが不正です"})
			return
		}

		var req dto.UpdateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user model.User
		if err := db.First(&user, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "データベースエラー"})
			}
			return
		}

		if req.Name != nil {
			user.Name = *req.Name
		}
		if req.Email != nil {
			newEmail := strings.ToLower(*req.Email)
			var existing model.User
			if err := db.Where("email = ? AND id <> ?", newEmail, user.ID).First(&existing).Error; err == nil {
				c.JSON(http.StatusConflict, gin.H{"error": "このメールアドレスは既に使用されています"})
				return
			} else if err != gorm.ErrRecordNotFound {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "メールアドレスの確認中にエラーが発生しました"})
				return
			}
			user.Email = newEmail
		}
		if req.Role != nil {
			user.Role = *req.Role
		}

		if err := db.Save(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ユーザー情報の更新に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "ユーザー情報を更新しました",
			"user":    user,
		})
	}
}
