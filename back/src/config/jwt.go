package config

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTSecret はJWT署名に使用する秘密鍵です。
// !!! 本番環境では、環境変数から読み込むなど、より安全な方法で管理してください !!!
var JWTSecret = []byte("your_super_secret_jwt_key_please_change_me")

// Claims はJWTのペイロードに含まれるカスタムクレームです
type Claims struct {
	UserID               uint   `json:"user_id"`
	UserEmail            string `json:"user_email"`
	RoleName             string `json:"role_name"`
	jwt.RegisteredClaims        // JWTの標準クレーム
}

// GenerateToken は指定されたユーザー情報でJWTを生成します
func GenerateToken(userID uint, email, roleName string) (string, error) {
	// トークンの有効期限を設定 (例: 24時間後)
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		UserID:    userID,
		UserEmail: email,
		RoleName:  roleName,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime), // 有効期限
			IssuedAt:  jwt.NewNumericDate(time.Now()),     // 発行時刻
			Subject:   "user_auth",                        // トークンの主題
		},
	}

	// HS256アルゴリズムで新しいトークンを作成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 秘密鍵でトークンに署名し、文字列として取得
	tokenString, err := token.SignedString(JWTSecret)
	if err != nil {
		return "", errors.New("トークンの生成に失敗しました")
	}
	return tokenString, nil
}

// ValidateToken はJWTを検証し、クレームを返します
func ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	// トークンをパースし、クレームと検証関数を渡す
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// 署名方法がHMACであることを確認
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("予期しない署名方法です")
		}
		return JWTSecret, nil // 秘密鍵を返す
	})

	if err != nil {
		// 署名が無効な場合
		if errors.Is(err, jwt.ErrSignatureInvalid) {
			return nil, errors.New("無効なトークン署名です")
		}
		// その他のパースエラー
		return nil, fmt.Errorf("トークンの検証に失敗しました: %w", err)
	}

	// トークンが有効でない場合 (期限切れなど)
	if !token.Valid {
		return nil, errors.New("無効なトークンです")
	}

	return claims, nil
}
