package request

type CreateScreenRequest struct {
	MaxRow    string `json:"max_row" binding:"required,gte=1"`
	MaxColumn int    `json:"max_column" binding:"required,max=10"`
}
