package usecase

import (
	"modules/database/model"
)

type SeatTypeUsecase struct {
	SeatRepo SeatTypeRepository
}

type SeatTypeRepository interface {
	Create(seat *model.SeatType) error
}

func (uc *SeatTypeUsecase) CreateSeatType(name string) (*model.SeatType, error) {
	seat := &model.SeatType{Name: name}
	if err := uc.SeatRepo.Create(seat); err != nil {
		return nil, err
	}
	return seat, nil
}
