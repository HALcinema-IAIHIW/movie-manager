package repository

import (
	"errors"
	"modules/src/database/model"

	"gorm.io/gorm"
)

type ReservationSeatRepository interface {
	CreateReservationSeat(reservationSeat *model.ReservationSeat) error
	FindAllReservationSeats() ([]model.ReservationSeat, error)
	GetReservationSeatsByScreenID(screenID uint) ([]model.ReservationSeat, error)
	GetReservationSeatsByScreeningID(screeningID uint) ([]model.ReservationSeat, error)
}

type GormReservationSeatRepository struct {
	DB *gorm.DB
}

func (r *GormReservationSeatRepository) GetReservationSeatsByScreenID(screenID uint) ([]model.ReservationSeat, error) {
	var reservationSeats []model.ReservationSeat
	err := r.DB.
		Joins("JOIN seats ON seats.id = reservation_seats.seat_id"). // ReservationSeatとSeatを結合
		Where("seats.screen_id = ?", screenID).                      // SeatのScreenIDでフィルタリング
		Preload("Seat").                                             // Seat情報をプリロード
		Find(&reservationSeats).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.ReservationSeat{}, nil
		}
		return nil, err
	}
	return reservationSeats, nil
}

func (r *GormReservationSeatRepository) GetReservationSeatsByScreeningID(screeningID uint) ([]model.ReservationSeat, error) {
	var reservationSeats []model.ReservationSeat
	err := r.DB.
		Joins("JOIN purchases ON purchases.id = reservation_seats.purchase_id").
		Where("purchases.screening_id = ?", screeningID).
		Preload("Seat"). // Seat情報もプリロード
		Find(&reservationSeats).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.ReservationSeat{}, nil
		}
		return nil, err
	}
	return reservationSeats, nil
}

func NewGormReservationSeatRepository(db *gorm.DB) *GormReservationSeatRepository {
	return &GormReservationSeatRepository{DB: db}
}

func (r *GormReservationSeatRepository) CreateReservationSeat(reservationSeat *model.ReservationSeat) error {
	if err := r.DB.Create(reservationSeat).Error; err != nil {
		return err
	}
	return nil
}

func (r *GormReservationSeatRepository) FindAllReservationSeats() ([]model.ReservationSeat, error) {
	var reservationSeats []model.ReservationSeat
	err := r.DB.Find(&reservationSeats).Error
	return reservationSeats, err
}
