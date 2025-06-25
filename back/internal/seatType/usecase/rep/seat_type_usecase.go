package rep

import (
	"modules/database/model"
)

type SeatTypeRepository interface {
	Create(seat *model.SeatType) error
}
