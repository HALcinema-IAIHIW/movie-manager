package usecases

import (
	"modules/src/database/model"
	"modules/src/repository"
	"time"
)

type ScreeningUsecase struct {
	ScreeningRepo repository.ScreeningRepository
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

func (uc *ScreeningUsecase) GetScreeningByID(id uint) (*model.Screening, error) {
	return uc.ScreeningRepo.FindByID(id)
}
