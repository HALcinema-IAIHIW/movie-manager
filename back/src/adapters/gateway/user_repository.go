package gateway

import (
	"modules/src/database/model"

	"gorm.io/gorm"
)

type GormUserRepository struct {
	DB *gorm.DB
}

func (r *GormUserRepository) Update(user *model.User) error {
	// Saveメソッドは、userオブジェクトの主キー(ID)を元に、
	// レコードの全フィールドを更新します。
	result := r.DB.Save(user)
	return result.Error
}

func (r *GormUserRepository) Create(user *model.User) error {
	return r.DB.Create(user).Error
}

func (r *GormUserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := r.DB.Preload("Role").Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindAll() ([]model.User, error) {
	var users []model.User
	if err := r.DB.Preload("Role").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *GormUserRepository) FindByID(id uint) (*model.User, error) {
	var user model.User
	if err := r.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) IsAdmin(userID uint) (bool, error) {
	var count int64
	err := r.DB.Table("admins").Where("user_id = ? AND deleted_at IS NULL", userID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func NewGormUserRepository(db *gorm.DB) *GormUserRepository {
	return &GormUserRepository{DB: db}
}
