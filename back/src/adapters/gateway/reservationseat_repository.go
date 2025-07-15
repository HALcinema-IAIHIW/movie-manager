package gateway

import (
	"errors"
	"modules/src/database/model"

	"gorm.io/gorm"
)

type ReservationSeatRepository interface {
	CreateReservationSeat(reservationSeat *model.ReservationSeat) error
	FindAllReservationSeats() ([]model.ReservationSeat, error)
	GetReservationSeatByID(id uint) (*model.ReservationSeat, error)
	GetReservationSeatsByScreenID(screenID uint) ([]model.ReservationSeat, error)
	GetReservationSeatsByScreeningID(screeningID uint) ([]model.ReservationSeat, error)
}

type GormReservationSeatRepository struct {
	DB *gorm.DB
}

func NewGormReservationSeatRepository(db *gorm.DB) *GormReservationSeatRepository {
	return &GormReservationSeatRepository{DB: db}
}

func (r *GormReservationSeatRepository) CreateReservationSeat(reservationSeat *model.ReservationSeat) error {
	return r.DB.Create(reservationSeat).Error
}

func (r *GormReservationSeatRepository) FindAllReservationSeats() ([]model.ReservationSeat, error) {
	var reservationSeats []model.ReservationSeat
	err := r.DB.Find(&reservationSeats).Error
	return reservationSeats, err
}

func (r *GormReservationSeatRepository) GetReservationSeatByID(id uint) (*model.ReservationSeat, error) {
	var reservationSeat model.ReservationSeat
	err := r.DB.First(&reservationSeat, id).Error
	if err != nil {
		return nil, err
	}
	return &reservationSeat, nil
}

func (r *GormReservationSeatRepository) GetReservationSeatsByScreenID(screenID uint) ([]model.ReservationSeat, error) {
	var reservationSeats []model.ReservationSeat
	err := r.DB.
		Joins("JOIN seats ON seats.id = reservation_seats.seat_id").
		Where("seats.screen_id = ?", screenID).
		Preload("Seat").
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

func (r *GormReservationSeatRepository) UpdateReservationSeat(seat *model.ReservationSeat) error {
	return r.DB.Save(seat).Error
}
