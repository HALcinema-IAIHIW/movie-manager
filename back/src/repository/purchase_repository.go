package repository

import (
	"errors"
	"modules/src/database/model" // modelパッケージをインポート

	"gorm.io/gorm"
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

func NewGormPurchaseRepository(db *gorm.DB) PurchaseRepository {
	return &GormPurchaseRepository{db: db}
}

func (r *GormPurchaseRepository) CreatePurchase(purchase *model.Purchase) error {
	return r.db.Create(purchase).Error
}

func (r *GormPurchaseRepository) GetAllPurchases() ([]model.Purchase, error) {
	var purchases []model.Purchase
	if err := r.db.Preload("PurchaseDetails.Role").Find(&purchases).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.Purchase{}, nil
		}
		return nil, err
	}
	return purchases, nil
}

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

// GetPurchasesByUserID は指定されたユーザーIDに紐づく全ての購入情報を取得します。
// 関連するデータを新しいモデルパスに合わせてプリロードします。
func (r *GormPurchaseRepository) GetPurchasesByUserID(userID uint) ([]model.Purchase, error) {
	var purchases []model.Purchase
	err := r.db.Where("user_id = ?", userID).
		Preload("Screening.ScreeningPeriod.Movie").
		Preload("Screening.ScreeningPeriod.Screen").
		Preload("ReservationSeats.Seat").
		Preload("PurchaseDetails.Role").
		Find(&purchases).Error
	return purchases, err
}
