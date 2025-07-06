package gateway

import (
	"modules/src/database/model" // modelパッケージのパスを確認

	"gorm.io/gorm"
)

// ReservationSeatRepository は ReservationSeat モデルのデータ操作を定義するインターフェースです。
type ReservationSeatRepository interface {
	CreateReservationSeat(reservationSeat *model.ReservationSeat) error
	FindAllReservationSeats() ([]model.ReservationSeat, error)
	GetReservationSeatByID(id uint) (*model.ReservationSeat, error)
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
