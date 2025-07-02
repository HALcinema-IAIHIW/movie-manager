package usecases

import (
	"errors"
	"strings"

	"modules/src/database/model"
	"modules/src/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var ErrEmailExists = errors.New("email already exists")

type RegisterUserInput struct {
	Name     string
	Email    string
	Password string
	RoleName string
}

type UserUsecase struct {
	UserRepo repository.UserRepository
	RoleRepo repository.RoleRepository
}

func (uc *UserUsecase) RegisterUser(input RegisterUserInput) (*model.User, error) {
	email := strings.ToLower(input.Email)

	// emailの重複チェック
	existing, err := uc.UserRepo.FindByEmail(email)
	if err == nil && existing != nil {
		return nil, ErrEmailExists
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// パスワードのハッシュ化
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	role, err := uc.RoleRepo.GetByRoleName(input.RoleName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("指定されたロールが存在しません")
		}
		return nil, err
	}
	if role == nil {
		return nil, errors.New("ロールがnilです")
	}

	user := &model.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hash),
		RoleID:   role.ID,
	}
	if err := uc.UserRepo.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (uc *UserUsecase) GetUser() ([]model.User, error) {
	return uc.UserRepo.FindAll()
}

func (uc *UserUsecase) GetUserByID(id uint) (*model.User, error) {
	return uc.UserRepo.FindByID(id)
}
