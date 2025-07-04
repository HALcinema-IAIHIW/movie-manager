package gateway

import (
	"errors"
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

	jst, _ := time.LoadLocation("Asia/Tokyo")
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, jst)
	endOfDay := startOfDay.Add(24 * time.Hour)

	err := r.DB.Preload("ScreeningPeriod").
		Preload("ScreeningPeriod.Movie").
		Preload("ScreeningPeriod.Screen").
		Where("date >= ? AND date < ?", startOfDay, endOfDay).
		Find(&screenings).Error

	return screenings, err
}

func (r *GormScreeningRepository) FindByID(id uint) (*model.Screening, error) {
	var screening model.Screening
	err := r.DB.
		Preload("ScreeningPeriod").
		Preload("ScreeningPeriod.Movie").
		Preload("ScreeningPeriod.Screen").
		First(&screening, id).Error
	if err != nil {
		return nil, err
	}
	return &screening, nil
}

func (r *GormScreeningRepository) FindByUniqueKey(screeningPeriodID uint, date time.Time, startTime time.Time) (*model.Screening, error) {
	var screening model.Screening

	err := r.DB.
		Where("screening_period_id = ? AND date = ? AND start_time = ?", screeningPeriodID, date, startTime).
		First(&screening).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // 存在しない
		}
		return nil, err
	}
	return &screening, nil
}
