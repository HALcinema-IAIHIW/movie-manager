package dto

type CreateUserRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	//パスワードは8文字以上
	Password string `json:"password" binding:"required,min=8"`
}
