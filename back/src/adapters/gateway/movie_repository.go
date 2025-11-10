package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormMovieRepository struct {
	DB *gorm.DB
}

func NewGormMovieRepository(db *gorm.DB) *GormMovieRepository {
	return &GormMovieRepository{DB: db}
}

func (r *GormMovieRepository) CreateMovie(movie *model.Movie) error {
	return r.DB.Create(movie).Error
}

func (r *GormMovieRepository) FindAllMovies() ([]model.Movie, error) {
	var movies []model.Movie
	err := r.DB.Find(&movies).Error
	return movies, err
}

func (r *GormMovieRepository) GetMovieByID(id uint) (*model.Movie, error) {
	var movie model.Movie
	err := r.DB.First(&movie, id).Error
	if err != nil {
		return nil, err
	}
	return &movie, nil
}

func (r *GormMovieRepository) UpdatePosterPath(id uint, posterPath string) error {
	return r.DB.Model(&model.Movie{}).
		Where("id = ?", id).
		Update("poster_path", posterPath).Error
}
