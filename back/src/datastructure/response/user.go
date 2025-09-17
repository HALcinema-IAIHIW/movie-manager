package response

import "time"

type UserResponse struct {
	ID             uint       `json:"id"`
	Name           string     `json:"name"`
	Email          string     `json:"email"`
	RoleName       string     `json:"role"`
	PhoneNumber    string     `json:"phone_number"`
	CardNumber     string     `json:"card_number"`
	CardExpiration *time.Time `json:"card_expiration"`
}

type LoginResponse struct {
	Message string       `json:"message"`
	Token   string       `json:"token"` // JWTトークン
	User    UserResponse `json:"user"`  // ログインしたユーザーの情報
}
