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

	err := r.DB.Preload("ScreeningPeriod").
		Preload("ScreeningPeriod.Movie").
		Preload("ScreeningPeriod.Screen").
		Where("start_time >= ? AND start_time < ?", start, end).
		// Where("date = ?", date).
		Find(&screenings).Error
	return screenings, err
}

func (r *GormScreeningRepository) FindByID(id uint) (*model.Screening, error) {
	var screening model.Screening
	err := r.DB.Preload("ScreeningPeriod").First(&screening, id).Error
	if err != nil {
		return nil, err
	}
	return &screening, nil
}
