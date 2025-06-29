package response

type ScreenResponse struct {
	ID        uint   `json:"id"`
	MaxRow    string `json:"max_row"`
	MaxColumn int    `json:"max_column"`
}
