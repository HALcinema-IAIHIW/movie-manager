package usecase

import (
	"modules/database/model"
	"modules/internal/screen/usecase/rep"
)

type ScreenUsecase struct {
	ScreenRepo rep.ScreenRepository
}

func NewScreenUsecase(repo rep.ScreenRepository) *ScreenUsecase {
	return &ScreenUsecase{ScreenRepo: repo}
}

func (uc *ScreenUsecase) CreateScreen(screen *model.Screen) error {
	return uc.ScreenRepo.Create(screen)
}

func (uc *ScreenUsecase) GetAllScreens() ([]model.Screen, error) {
	return uc.ScreenRepo.FindAll()
}
