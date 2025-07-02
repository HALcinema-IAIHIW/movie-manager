package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type gormScreenRepository struct {
	db *gorm.DB
}

func NewGormScreenRepository(db *gorm.DB) *gormScreenRepository {
	return &gormScreenRepository{db: db}
}

func (r *gormScreenRepository) Create(screen *model.Screen) error {
	return r.db.Create(screen).Error
}

func (r *gormScreenRepository) FindAll() ([]model.Screen, error) {
	var screens []model.Screen
	result := r.db.Find(&screens)
	return screens, result.Error
}

func (r *gormScreenRepository) FindByID(id uint) (*model.Screen, error) {
	var screen model.Screen
	if err := r.db.First(&screen, id).Error; err != nil {
		return nil, err
	}
	return &screen, nil
}
