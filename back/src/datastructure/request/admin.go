package request

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type AdminPromoteRequest struct {
	UserID uint `json:"user_id" binding:"required"`
}
