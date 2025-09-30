package response

type MovieResponse struct {
	ID          uint     `json:"id"`
	Title       string   `json:"title"`
	SubTitle    string   `json:"subtitle"`
	Description string   `json:"description"`
	ReleaseDate string   `json:"release_date"`
	Genre       string   `json:"genre"`
	Director    string   `json:"director"`
	Cast        []string `json:"cast"`
	Duration    int      `json:"duration"`
	PosterPath  string   `json:"poster_path"`
}
