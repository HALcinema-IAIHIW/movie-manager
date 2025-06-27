package usecases

import (
	"modules/src/database/model"
	"modules/src/repository"
)

type ScreenUsecase struct {
	ScreenRepo repository.ScreenRepository
}

func NewScreenUsecase(repo repository.ScreenRepository) *ScreenUsecase {
	return &ScreenUsecase{ScreenRepo: repo}
}

func (uc *ScreenUsecase) CreateScreen(screen *model.Screen) error {
	return uc.ScreenRepo.Create(screen)
}

func (uc *ScreenUsecase) GetAllScreens() ([]model.Screen, error) {
	return uc.ScreenRepo.FindAll()
}

func (uc *ScreenUsecase) GetScreenByID(id uint) (*model.Screen, error) {
	return uc.ScreenRepo.FindByID(id)
}
