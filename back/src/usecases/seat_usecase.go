package usecases

import (
	"fmt"
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
	return uc.SeatRepo.GetAll()
}

func (uc *SeatUsecase) GetSeatsByScreenID(id uint) ([]model.Seat, error) {
	return uc.SeatRepo.FindByScreenID(id)
}

func (uc *SeatUsecase) GetSeatByRowColumnScreenID(row string, column int, screenID uint) (*model.Seat, error) {
	seat, err := uc.SeatRepo.GetSeatByRowColumnScreenID(row, column, screenID)
	if err != nil {
		// リポジトリがエラーを返すので、そのままエラーを伝える
		return nil, fmt.Errorf("座席情報(行: %s, 列: %d, スクリーンID: %d) の取得に失敗しました: %w", row, column, screenID, err)
	}
	return seat, nil // 取得した座席を返す
}
