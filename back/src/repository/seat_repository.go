package repository

import (
	"modules/src/database/model"
)

type SeatRepository interface {
	Create(seat *model.Seat) error
	GetAll() ([]model.Seat, error)
}
