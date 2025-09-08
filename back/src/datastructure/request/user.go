package request

import "time"

type CreateUserRequest struct {
	Name           string     `json:"name" binding:"required,min=2,max=50"`
	Email          string     `json:"email" binding:"required,email"`
	Password       string     `json:"password" binding:"required,min=8"`
	RoleName       string     `json:"role_name" binding:"required"`
	PhoneNumber    string     `json:"phone"`
	CardNumber     string     `json:"card_number"`
	CardExpiration *time.Time `json:"card_expiration"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"` // 適切なバリデーションルールを設定
}

type UpdateUserRequest struct {
	Name           *string `json:"name"`
	Email          *string `json:"email" binding:"omitempty,email"`
	Password       *string `json:"password" binding:"omitempty,min=8"` // パスワードは8文字以上など
	RoleName       *string `json:"role_name"`
	PhoneNumber    *string `json:"phone"`
	CardNumber     *string `json:"card_number"`
	CardExpiration *string `json:"card_expiration"`
}
