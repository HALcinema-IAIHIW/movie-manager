package gateway

import (
	"modules/src/database/model" // model.Seat が定義されているパスに合わせてください

	"gorm.io/gorm"
)

type GormSeatRepository struct {
	db *gorm.DB
}

func NewGormSeatRepository(db *gorm.DB) *GormSeatRepository {
	return &GormSeatRepository{db: db}
}

func (r *GormSeatRepository) Create(seat *model.Seat) error { // レシーバーの型を変更
	return r.db.Create(seat).Error
}

func (r *GormSeatRepository) FindByScreenID(screenID uint) ([]model.Seat, error) { // レシーバーの型を変更
	var seats []model.Seat
	err := r.db.Where("screen_id = ?", screenID).Find(&seats).Error
	return seats, err
}

func (r *GormSeatRepository) GetAll() ([]model.Seat, error) { // レシーバーの型を変更
	var seats []model.Seat
	err := r.db.Find(&seats).Error
	return seats, err
}
