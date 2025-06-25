package repository

import (
	"gorm.io/gorm"
	"modules/database/model"
)

type GormScreenRepository struct {
	db *gorm.DB
}

func NewGormScreenRepository(db *gorm.DB) *GormScreenRepository {
	return &GormScreenRepository{db: db}
}

func (r *GormScreenRepository) Create(screen *model.Screen) error {
	return r.db.Create(screen).Error
}

func (r *GormScreenRepository) FindAll() ([]model.Screen, error) {
	var screens []model.Screen
	result := r.db.Find(&screens)
	return screens, result.Error
}
