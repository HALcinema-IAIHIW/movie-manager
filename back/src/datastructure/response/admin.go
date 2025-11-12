package response

import "time"

type AdminUserResponse struct {
	ID             uint       `json:"id"`
	Name           string     `json:"name"`
	Email          string     `json:"email"`
	RoleName       string     `json:"role"`
	PhoneNumber    string     `json:"phone_number"`
	CardNumber     string     `json:"card_number"`
	CardExpiration *time.Time `json:"card_expiration"`
	IsAdmin        bool       `json:"is_admin"`
}

type AdminLoginResponse struct {
	Message string            `json:"message"`
	Token   string            `json:"token"`
	User    AdminUserResponse `json:"user"`
}