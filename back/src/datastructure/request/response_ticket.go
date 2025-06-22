package request

import "time"

type TicketResponse struct {
	ID        uint      `json:"id"`
	Type      string    `json:"type"`
	PriceYen  int       `json:"price_yen"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
