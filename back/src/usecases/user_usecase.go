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
}

type UserUsecase struct {
	UserRepo repository.UserRepository
}

func (uc *UserUsecase) RegisterUser(input RegisterUserInput) (*model.User, error) {
	email := strings.ToLower(input.Email)

	existing, err := uc.UserRepo.FindByEmail(email)
	if err == nil && existing != nil {
		return nil, ErrEmailExists
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Name:     input.Name,
		Email:    email,
		Password: string(hash),
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
