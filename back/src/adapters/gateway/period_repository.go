package gateway

import (
	"modules/src/database/model"
	"time"

	"gorm.io/gorm"
)

type GormPeriodRepository struct {
	DB *gorm.DB
}

func NewGormPeriodRepository(db *gorm.DB) *GormPeriodRepository {
	return &GormPeriodRepository{DB: db}
}

func (r *GormPeriodRepository) CreatePeriod(period *model.ScreeningPeriod) error {
	return r.DB.Create(&period).Error
}

func (r *GormPeriodRepository) GetAllPeriods() ([]model.ScreeningPeriod, error) {
	var periods []model.ScreeningPeriod
	if err := r.DB.Find(&periods).Error; err != nil {
		return nil, err
	}
	return periods, nil
}

func (r *GormPeriodRepository) GetPeriodsByDate(date time.Time) ([]model.ScreeningPeriod, error) {
	var periods []model.ScreeningPeriod
	if err := r.DB.
		Where("start_date <= ? AND end_date >= ?", date, date).
		Find(&periods).Error; err != nil {
		return nil, err
	}
	return periods, nil
}
