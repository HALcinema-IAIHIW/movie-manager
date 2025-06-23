package gateway

import (
	"modules/src/database/model"
	"time"

	"gorm.io/gorm"
)

type GormScreeningRepository struct {
	DB *gorm.DB
}

func NewGormScreeningRepository(db *gorm.DB) *GormScreeningRepository {
	return &GormScreeningRepository{DB: db}
}

func (r *GormScreeningRepository) Create(screening *model.Screening) error {
	return r.DB.Create(screening).Error
}

func (r *GormScreeningRepository) FindByDate(date time.Time) ([]model.Screening, error) {
	var screenings []model.Screening
	start := date.Truncate(24 * time.Hour)
	end := start.Add(24 * time.Hour)
	err := r.DB.Where("start_time >= ? AND start_time < ?", start, end).Find(&screenings).Error
	return screenings, err
}
