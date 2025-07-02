package presenter

import (
	"modules/src/database/model"
	"time"
)

type PurchaseResponse struct {
	ID              uint                     `json:"id"`
	UserID          uint                     `json:"user_id"`
	ScreeningID     uint                     `json:"screening_id"`
	TotalPrice      int                      `json:"total_price"`
	PurchaseTime    time.Time                `json:"purchase_time"`
	CreatedAt       time.Time                `json:"created_at"`
	UpdatedAt       time.Time                `json:"updated_at"`
	PurchaseDetails []PurchaseDetailResponse `json:"purchase_details"` // PurchaseDetailResponseのスライスを追加
}

type PurchaseDetailResponse struct {
	ID         uint `json:"id"`
	PurchaseID uint `json:"purchase_id"`
	RoleID     uint `json:"role_id"`
	Quantity   int  `json:"quantity"`
	PriceYen   int  `json:"price_yen"`
	Subtotal   int  `json:"subtotal"`
}

func ToPurchaseDetailResponse(pd model.PurchaseDetail) PurchaseDetailResponse {
	return PurchaseDetailResponse{
		ID:         pd.ID,
		PurchaseID: pd.PurchaseID,
		RoleID:     pd.RoleID,
		Quantity:   pd.Quantity,
		PriceYen:   pd.PriceYen,
		Subtotal:   pd.Subtotal,
	}
}

func ToPurchaseDetailResponseList(pds []model.PurchaseDetail) []PurchaseDetailResponse {
	var responses []PurchaseDetailResponse
	for _, pd := range pds {
		responses = append(responses, ToPurchaseDetailResponse(pd))
	}
	return responses
}

func ToPurchaseResponse(p model.Purchase) PurchaseResponse {
	return PurchaseResponse{
		ID:              p.ID,
		UserID:          p.UserID,
		ScreeningID:     p.ScreeningID,
		TotalPrice:      p.TotalPrice,
		PurchaseTime:    p.PurchaseTime,
		CreatedAt:       p.CreatedAt,
		UpdatedAt:       p.UpdatedAt,
		PurchaseDetails: ToPurchaseDetailResponseList(p.PurchaseDetails),
	}
}

func ToPurchaseResponseList(purchases []model.Purchase) []PurchaseResponse {
	var responses []PurchaseResponse
	for _, p := range purchases {
		responses = append(responses, ToPurchaseResponse(p))
	}
	return responses
}
