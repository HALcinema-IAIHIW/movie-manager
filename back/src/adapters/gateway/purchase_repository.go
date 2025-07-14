package gateway

import (
	"errors"
	"gorm.io/gorm"
	"modules/src/database/model"
	"modules/src/repository"
)

type PurchaseRepository interface {
	CreatePurchase(purchase *model.Purchase) error
	GetAllPurchases() ([]model.Purchase, error)
	GetPurchaseByID(id uint) (*model.Purchase, error)
	GetPurchasesByUserID(userID uint) ([]model.Purchase, error)
}

type GormPurchaseRepository struct {
	db *gorm.DB
}

func NewGormPurchaseRepository(db *gorm.DB) repository.PurchaseRepository {
	return &GormPurchaseRepository{db: db}
}

// CreatePurchase の実装
func (r *GormPurchaseRepository) CreatePurchase(purchase *model.Purchase) error {
	return r.db.Create(purchase).Error
}

// GetAllPurchases の実装
func (r *GormPurchaseRepository) GetAllPurchases() ([]model.Purchase, error) {
	var purchases []model.Purchase
	// Preload はユースケースで指定されることが多いが、リポジトリで固定しても良い
	if err := r.db.Preload("PurchaseDetails.Role").Find(&purchases).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.Purchase{}, nil
		}
		return nil, err
	}
	return purchases, nil
}

// GetPurchaseByID の実装
func (r *GormPurchaseRepository) GetPurchaseByID(id uint) (*model.Purchase, error) {
	var purchase model.Purchase
	if err := r.db.Preload("PurchaseDetails.Role").First(&purchase, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &purchase, nil
}

// GetPurchasesByUserID の実装
func (r *GormPurchaseRepository) GetPurchasesByUserID(userID uint) ([]model.Purchase, error) {
	var purchases []model.Purchase
	err := r.db.Where("user_id = ?", userID).
		Preload("Screening").
		Preload("Screening.ScreeningPeriod").
		Preload("Screening.ScreeningPeriod.Movie").
		Preload("Screening.ScreeningPeriod.Screen").
		Preload("ReservationSeats").
		Preload("ReservationSeats.Seat").
		Preload("PurchaseDetails").
		Preload("PurchaseDetails.Role").
		Find(&purchases).Error
	return purchases, err
}
