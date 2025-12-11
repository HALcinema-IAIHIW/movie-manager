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

func (r *GormScreeningRepository) IsOverlap(screenID uint, date time.Time, startTime time.Time, duration int) (bool, error) {
	var screenings []model.Screening

	err := r.DB.Where("screen_id = ? AND date = ?", screenID, date).Find(&screenings).Error
	if err != nil {
		return false, err
	}

	newStart := startTime
	newEnd := startTime.Add(time.Duration(duration) * time.Minute)

	for _, s := range screenings {
		existingStart := s.StartTime
		existingEnd := s.StartTime.Add(time.Duration(s.Duration) * time.Minute)

		// 重複判定: (既存開始 < 新規終了) AND (既存終了 > 新規開始)
		if existingStart.Before(newEnd) && existingEnd.After(newStart) {
			return true, nil // 重複あり
		}
	}

	return false, nil // 重複なし
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

	err := r.DB.Preload("Screen").
		Preload("ScreeningPeriod").
		Preload("ScreeningPeriod.Movie").
		Preload("Screen").
		Where("date >= ? AND date < ?", startOfDay, endOfDay).
		Find(&screenings).Error

	return screenings, err
}

func (r *GormScreeningRepository) FindByID(id uint) (*model.Screening, error) {
	var screening model.Screening
	err := r.DB.
		Preload("ScreeningPeriod").
		Preload("ScreeningPeriod.Movie").
		Preload("Screen").
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
