package dto

type UpdateMovieRequest struct {
	Title       *string `json:"title,omitempty" binding:"required"`
	Description *string `json:"description,omitempty"`
	ReleaseDate *string `json:"release_date,omitempty" binding:"required,datetime=2025-05-26"`
	Genre       *string `json:"genre,omitempty"`
	Director    *string `json:"director,omitempty"`
}
