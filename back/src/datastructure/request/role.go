package request

type CreateRoleRequest struct {
	RoleName string `form:"role_name" binding:"required"`
	PriceYen int    `form:"price_yen" binding:"required"`
}
