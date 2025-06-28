package gateway

import (
	"modules/src/database/model"

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
