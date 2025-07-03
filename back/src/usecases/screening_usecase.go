package usecases

import (
	"errors"
	"modules/src/database/model"
	"modules/src/repository"
	"time"
)

var ErrDuplicateScreening = errors.New("同じ上映が既に存在します")

type ScreeningUsecase struct {
	ScreeningRepo repository.ScreeningRepository
}

func (uc *ScreeningUsecase) CreateScreening(screening *model.Screening) (*model.Screening, error) {
	existing, err := uc.ScreeningRepo.FindByUniqueKey(screening.ScreeningPeriodID, screening.Date, screening.StartTime)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrDuplicateScreening
	}

	if err := uc.ScreeningRepo.Create(screening); err != nil {
		return nil, err
	}

	result, err := uc.ScreeningRepo.FindByID(screening.ID)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (uc *ScreeningUsecase) GetScreeningsByDate(date time.Time) ([]model.Screening, error) {
	return uc.ScreeningRepo.FindByDate(date)
}

func (uc *ScreeningUsecase) GetScreeningByID(id uint) (*model.Screening, error) {
	return uc.ScreeningRepo.FindByID(id)
}
