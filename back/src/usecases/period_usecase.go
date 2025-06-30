package usecases

import (
	"modules/src/database/model"
)

type PeriodUsecase struct {
	PeriodRepo PeriodRepository
}

type PeriodRepository interface {
	CreatePeriod(period *model.ScreeningPeriod) error
}

func (u *PeriodUsecase) CreatePeriod(period *model.ScreeningPeriod) error {
	return u.PeriodRepo.CreatePeriod(period)
}
