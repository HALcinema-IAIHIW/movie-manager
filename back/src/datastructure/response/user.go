package response

type UserResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	RoleName string `json:"role"`
}

type LoginResponse struct {
	Message string       `json:"message"`
	Token   string       `json:"token"` // JWTトークン
	User    UserResponse `json:"user"`  // ログインしたユーザーの情報
}
