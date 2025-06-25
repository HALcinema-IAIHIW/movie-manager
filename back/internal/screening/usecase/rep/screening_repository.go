package rep

import (
	"modules/database/model"
	"time"
)

type ScreeningRepository interface {
	Create(screening *model.Screening) error
	GetByFilters(movieID uint, startTime *time.Time, status string, isActive *bool) ([]*model.Screening, error)
}
