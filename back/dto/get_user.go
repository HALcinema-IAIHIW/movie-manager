package dto

type GetUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}
