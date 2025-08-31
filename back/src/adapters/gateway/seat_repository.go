package gateway

import (
	"errors"
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormSeatRepository struct {
	db *gorm.DB
}

func NewGormSeatRepository(db *gorm.DB) *GormSeatRepository {
	return &GormSeatRepository{db: db}
}

func (r *GormSeatRepository) Create(seat *model.Seat) error {
	return r.db.Create(seat).Error
}

func (r *GormSeatRepository) FindByScreenID(screenID uint) ([]model.Seat, error) {
	var seats []model.Seat
	err := r.db.Where("screen_id = ?", screenID).Find(&seats).Error
	return seats, err
}

func (r *GormSeatRepository) GetAll() ([]model.Seat, error) {
	var seats []model.Seat
	err := r.db.Find(&seats).Error
	return seats, err
}

func (r *GormSeatRepository) GetSeatByRowColumnScreenID(row string, column int, screenID uint) (*model.Seat, error) {
	var seat model.Seat
	err := r.db.Where("row = ? AND \"column\" = ? AND screen_id = ?", row, column, screenID).First(&seat).Error // "column" はエスケープ済み
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // レコードが見つからない場合はnil, nilを返す
		}
		return nil, err // その他のエラーはそのまま返す
	}
	return &seat, nil // 座席が見つかった場合はポインタとnilを返す
}
