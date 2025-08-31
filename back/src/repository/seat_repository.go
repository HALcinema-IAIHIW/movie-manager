package repository

import (
	"modules/src/database/model"
)

type SeatRepository interface {
	Create(seat *model.Seat) error
	GetAll() ([]model.Seat, error)
	FindByScreenID(screenID uint) ([]model.Seat, error)
	GetSeatByRowColumnScreenID(row string, column int, screenID uint) (*model.Seat, error)
}
