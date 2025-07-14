package response

type ReservedSeatResponse struct {
	ReservationSeatID uint   `json:"reservation_seat_id"` // 予約座席のデータベースID
	PurchaseID        uint   `json:"purchase_id"`         // 関連する購入のID
	SeatID            uint   `json:"seat_id"`             // 予約された座席のID
	IsCancelled       bool   `json:"is_cancelled"`        // キャンセルされているか
	SeatNumber        string `json:"seat_number"`         // 座席の表示名 (例: "A1", "B5")
}
