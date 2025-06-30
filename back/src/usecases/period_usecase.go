package usecases

import (
	"modules/src/database/model"
	"time"
)

type PeriodUsecase struct {
	PeriodRepo PeriodRepository
}

type PeriodRepository interface {
	CreatePeriod(period *model.ScreeningPeriod) error
	GetAllPeriods() ([]model.ScreeningPeriod, error)
	GetPeriodsByDate(date time.Time) ([]model.ScreeningPeriod, error)
}

func (u *PeriodUsecase) CreatePeriod(period *model.ScreeningPeriod) error {
	return u.PeriodRepo.CreatePeriod(period)
}

func (u *PeriodUsecase) GetAllPeriods() ([]model.ScreeningPeriod, error) {
	return u.PeriodRepo.GetAllPeriods()
}

func (u *PeriodUsecase) GetPeriodsByDate(date time.Time) ([]model.ScreeningPeriod, error) {
	return u.PeriodRepo.GetPeriodsByDate(date)
}
