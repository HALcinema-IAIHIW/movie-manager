package usecases

import (
	"modules/src/database/model"
	"modules/src/repository" // SeatRepository インターフェースのパス
)

type SeatUsecase struct {
	SeatRepo repository.SeatRepository
}

func (uc *SeatUsecase) CreateSeat(seat *model.Seat) error {
	return uc.SeatRepo.Create(seat)
}

func (uc *SeatUsecase) GetAllSeats() ([]model.Seat, error) {
	// ここを uc.SeatRepo.GetAll() に変更します
	return uc.SeatRepo.GetAll() // <-- これで GormSeatRepository の GetAll() が呼ばれる
}
