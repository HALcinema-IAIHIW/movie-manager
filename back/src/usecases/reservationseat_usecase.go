package usecases

import (
	"fmt"
	"modules/src/database/model"
	"modules/src/repository"
)

type ReservationSeatUsecase struct {
	ReservationSeatRepo repository.ReservationSeatRepository
}

func NewReservationSeatUsecase(repo repository.ReservationSeatRepository) *ReservationSeatUsecase {
	return &ReservationSeatUsecase{ReservationSeatRepo: repo}
}

func (uc *ReservationSeatUsecase) CreateReservationSeat(reservationSeat *model.ReservationSeat) error {

	if err := uc.ReservationSeatRepo.CreateReservationSeat(reservationSeat); err != nil {
		return fmt.Errorf("座席予約の作成に失敗しました: %w", err)
	}
	return nil
}

func (uc *ReservationSeatUsecase) GetAllReservationSeats() ([]model.ReservationSeat, error) {
	reservationSeats, err := uc.ReservationSeatRepo.FindAllReservationSeats()
	if err != nil {
		return nil, fmt.Errorf("全ての座席予約の取得に失敗しました: %w", err)
	}
	return reservationSeats, nil
}
