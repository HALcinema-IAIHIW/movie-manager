package repository

import (
	"modules/src/database/model"
	"time"
)

type ScreeningRepository interface {
	Create(screening *model.Screening) error
	FindByDate(date time.Time) ([]model.Screening, error)
	FindByID(id uint) (*model.Screening, error)
	FindByUniqueKey(screeningPeriodID uint, date time.Time, startTime time.Time) (*model.Screening, error)
}
