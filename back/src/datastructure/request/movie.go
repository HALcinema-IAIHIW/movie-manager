package request

type CreateMovieRequest struct {
	Title       string   `json:"title" binding:"required"`
	SubTitle    string   `json:"subtitle"`
	Description string   `json:"description"`
	ReleaseDate string   `json:"release_date" binding:"required"`
	Genre       string   `json:"genre"`
	Director    string   `json:"director"`
	Cast        []string `json:"cast"`
	Duration    int      `json:"duration" binding:"required"`
}
