package middleware

import (
	"modules/src/config"
	"modules/src/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AdminAuthMiddleware(userRepo repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Authorization ヘッダーからトークンを取得
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "認証ヘッダーが見つかりません",
			})
			c.Abort()
			return
		}

		// Bearer プレフィックスをチェック
		tokenString := ""
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = authHeader[7:] // "Bearer " を除去
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "無効な認証形式です",
			})
			c.Abort()
			return
		}

		// JWTトークンを検証
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// 署名方式がHMACかどうかチェック
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, gin.Error{Err: jwt.ErrSignatureInvalid}
			}
			return []byte(config.GetJWTSecret()), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "無効なトークンです",
			})
			c.Abort()
			return
		}

		// クレームからユーザー情報を取得
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "トークンクレームの解析に失敗しました",
			})
			c.Abort()
			return
		}

		// ユーザーIDを取得
		userID, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "ユーザーIDが見つかりません",
			})
			c.Abort()
			return
		}

		// 管理者権限チェック
		isAdmin, err := userRepo.IsAdmin(uint(userID))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "管理者権限の確認中にエラーが発生しました",
			})
			c.Abort()
			return
		}

		if !isAdmin {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "管理者権限が必要です",
			})
			c.Abort()
			return
		}

		// ユーザー情報をコンテキストに設定
		c.Set("userID", uint(userID))
		c.Set("isAdmin", true)

		// 次のハンドラーに進む
		c.Next()
	}
}