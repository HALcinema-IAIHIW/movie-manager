package usecases

import (
	"fmt"
	"modules/src/database/model"
	"modules/src/datastructure/response" // ★ここを確認してね！この行が必要だよ★
	"modules/src/repository"
	"strconv"
)

type ReservationSeatUsecase struct {
	ReservationSeatRepo repository.ReservationSeatRepository
	// 他に必要なリポジトリがあればここに追加
}

func NewReservationSeatUsecase(rsr repository.ReservationSeatRepository) *ReservationSeatUsecase {
	return &ReservationSeatUsecase{ReservationSeatRepo: rsr}
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

func (uc *ReservationSeatUsecase) GetReservedSeatsByScreeningID(screeningID uint) ([]response.ReservedSeatResponse, error) {
	reservationSeats, err := uc.ReservationSeatRepo.GetReservationSeatsByScreeningID(screeningID)
	if err != nil {
		return nil, fmt.Errorf("上映ID %d の予約座席の取得に失敗しました: %w", screeningID, err)
	}

	var reservedSeatsResponse []response.ReservedSeatResponse
	for _, rs := range reservationSeats {
		if rs.Seat.ID == 0 {
			continue
		}

		reservedSeatsResponse = append(reservedSeatsResponse, response.ReservedSeatResponse{
			ReservationSeatID: rs.ID,
			PurchaseID:        rs.PurchaseID,
			SeatID:            rs.SeatID,
			IsCancelled:       rs.IsCancelled,
			SeatNumber:        rs.Seat.Row + strconv.Itoa(rs.Seat.Column),
		})
	}
	return reservedSeatsResponse, nil
}

// GetReservedSeatsByScreenID はScreenIDで予約座席を取得し、表示用に整形するよ。
func (uc *ReservationSeatUsecase) GetReservedSeatsByScreenID(screenID uint) ([]response.ReservedSeatResponse, error) { // ★ここでの型参照★
	reservationSeats, err := uc.ReservationSeatRepo.GetReservationSeatsByScreenID(screenID)
	if err != nil {
		return nil, fmt.Errorf("スクリーンID %d の予約座席の取得に失敗しました: %w", screenID, err)
	}

	var reservedSeatsResponse []response.ReservedSeatResponse // ★ここでの型参照★
	for _, rs := range reservationSeats {
		if rs.Seat.ID == 0 {
			continue
		}

		reservedSeatsResponse = append(reservedSeatsResponse, response.ReservedSeatResponse{ // ★ここでの型参照★
			ReservationSeatID: rs.ID,
			PurchaseID:        rs.PurchaseID,
			SeatID:            rs.SeatID,
			IsCancelled:       rs.IsCancelled,
			SeatNumber:        rs.Seat.Row + strconv.Itoa(rs.Seat.Column),
		})
	}
	return reservedSeatsResponse, nil
}
