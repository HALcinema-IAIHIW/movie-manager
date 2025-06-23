package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormSeatTypeRepository struct {
	DB *gorm.DB
}

func NewGormSeatTypeRepository(db *gorm.DB) *GormSeatTypeRepository {
	return &GormSeatTypeRepository{DB: db}
}

func (r *GormSeatTypeRepository) Create(seat *model.SeatType) error {
	return r.DB.Create(seat).Error
}
