package dto

type UpdateScreenRequest struct {
	MaxRow    *int    `json:"max_row,omitempty,gte=1"`
	MaxColumn *string `json:"max_column,omitempty"`
}
