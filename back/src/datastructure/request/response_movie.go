package dto

type MovieResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ReleaseDate string `json:"release_date"`
	Genre       string `json:"genre"`
	Director    string `json:"director"`
	CeratedAt   string `json:"cerated_at"`
	UpdatedAt   string `json:"updated_at"`
}
