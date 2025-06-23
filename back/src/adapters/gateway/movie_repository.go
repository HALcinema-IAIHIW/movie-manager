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

func (r *GormMovieRepository) Create(movie *model.Movie) error {
	return r.DB.Create(movie).Error
}

func (r *GormMovieRepository) FindAll() ([]model.Movie, error) {
	var movies []model.Movie
	err := r.DB.Find(&movies).Error
	return movies, err
}

func (r *GormMovieRepository) FindByID(id uint) (*model.Movie, error) {
	var movie model.Movie
	err := r.DB.First(&movie, id).Error
	if err != nil {
		return nil, err
	}
	return &movie, nil
}
