package request

type CreateRoleRequest struct {
	ID       uint   `json:"id"`
	RoleName string `json:"role_name" binding:"required"`
	PriceYen int    `json:"price_yen" binding:"required"`
}
