package response

type ScreenResponse struct {
	ID        uint   `json:"id"`
	MaxRow    int    `json:"max_row"`
	MaxColumn string `json:"max_column"`
}
