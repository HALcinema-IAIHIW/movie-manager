package repository

import "modules/src/database/model"

type SeatTypeRepository interface {
	Create(seat *model.SeatType) error
}
