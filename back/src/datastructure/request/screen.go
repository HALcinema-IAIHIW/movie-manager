package request

type CreateScreenRequest struct {
	MaxRow    string `json:"max_row" binding:"required,max=10"`
	MaxColumn int    `json:"max_column" binding:"required,gte=1"`
}
