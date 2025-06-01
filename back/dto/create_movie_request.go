package dto

type CreateMovieRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	ReleaseDate string `json:"release_date" binding:"required,datetime=2025-05-26"` //YYYY-MM-DDを想定
	Genre       string `json:"genre"`
	Director    string `json:"director"`
}
