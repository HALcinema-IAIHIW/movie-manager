package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormPurchaseRepository struct {
	db *gorm.DB
}

func NewGormPurchaseRepository(db *gorm.DB) *GormPurchaseRepository {
	return &GormPurchaseRepository{db: db}
}

func (r *GormPurchaseRepository) Create(purchase *model.Purchase) error {
	return r.db.Create(purchase).Error
}

func (r *GormSeatRepository) FindByScreeningID(screeningID uint) ([]model.Purchase, error) {
	var purchases []model.Purchase
	err := r.db.Where("screen_id = ?", screeningID).Find(&purchases).Error
	return purchases, err
}

func (r *GormPurchaseRepository) GetAll() ([]model.Purchase, error) {
	var purchases []model.Purchase
	err := r.db.Find(&purchases).Error
	return purchases, err
}
