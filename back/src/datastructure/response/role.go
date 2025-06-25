package response

type RoleResponse struct {
	ID       uint   `json:"id"`
	RoleName string `json:"role_name"`
	PriceYen int    `json:"price_yen"`
}
