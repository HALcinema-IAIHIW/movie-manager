package repository

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type ReservationSeatRepository interface {
	CreateReservationSeat(reservationSeat *model.ReservationSeat) error
	FindAllReservationSeats() ([]model.ReservationSeat, error)
}

type GormReservationSeatRepository struct {
	DB *gorm.DB
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
