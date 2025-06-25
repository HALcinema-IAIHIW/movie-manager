package usecase

import (
	"modules/database/model"
	"time"
)

type ScreeningRepository interface {
	Create(screening *model.Screening) error
	FindByDate(date time.Time) ([]model.Screening, error)
}

type ScreeningUsecase struct {
	ScreeningRepo ScreeningRepository
}

func (uc *ScreeningUsecase) CreateScreening(screening *model.Screening) (*model.Screening, error) {
	if err := uc.ScreeningRepo.Create(screening); err != nil {
		return nil, err
	}
	return screening, nil
}

func (uc *ScreeningUsecase) GetScreeningsByDate(date time.Time) ([]model.Screening, error) {
	return uc.ScreeningRepo.FindByDate(date)
}
