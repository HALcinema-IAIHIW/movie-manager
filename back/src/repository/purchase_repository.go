package repository

import (
	"errors"
	"modules/src/database/model"

	"gorm.io/gorm"
)

type PurchaseRepository interface {
	CreatePurchase(purchase *model.Purchase) error
	GetAllPurchases() ([]model.Purchase, error)
	GetPurchaseByID(id uint) (*model.Purchase, error)
	GetRoleByID(roleID uint) (*model.Role, error)
}

type purchaseRepository struct {
	db *gorm.DB
}

func NewPurchaseRepository(db *gorm.DB) PurchaseRepository {
	return &purchaseRepository{db: db}
}

func (r *purchaseRepository) CreatePurchase(purchase *model.Purchase) error {
	// GORMのCreateは関連するPurchaseDetailsも自動的に挿入します
	return r.db.Create(purchase).Error
}

func (r *purchaseRepository) GetAllPurchases() ([]model.Purchase, error) {
	var purchases []model.Purchase
	// PurchaseDetails もプリロードする
	if err := r.db.Preload("PurchaseDetails").Find(&purchases).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []model.Purchase{}, nil // レコードが見つからない場合は空のスライスを返す
		}
		return nil, err
	}
	return purchases, nil
}

func (r *purchaseRepository) GetPurchaseByID(id uint) (*model.Purchase, error) {
	var purchase model.Purchase
	// PurchaseDetails もプリロードする
	if err := r.db.Preload("PurchaseDetails").First(&purchase, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // レコードが見つからない場合はnilを返す
		}
		return nil, err
	}
	return &purchase, nil
}

func (r *purchaseRepository) GetRoleByID(roleID uint) (*model.Role, error) {
	var role model.Role
	if err := r.db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}
