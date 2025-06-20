package dto

type CreateTicketRequest struct {
	Type     string `json:"type" binding:"required"`
	PriceYen int    `json:"price_yen" binding:"required,gte=0"`
}
