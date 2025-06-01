package dto

type UpdateTicketRequest struct {
	Type     *string `json:"type,omitempty"`
	PriceYen *int    `json:"price_yen,omitempty,gte=0"`
}
