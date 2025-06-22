package request

type CreateScreenRequest struct {
	MaxRow    int    `json:"max_row" binding:"required,gte=1"`
	MaxColumn string `json:"max_column" binding:"required"`
}
