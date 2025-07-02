package request

type CreateRoleRequest struct {
	RoleName string `json:"role_name" binding:"required"`
	PriceYen int    `json:"price_yen" binding:"required"`
}
