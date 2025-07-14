package usecases

import (
	"errors"
	"fmt"
	"modules/src/config"
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
	RoleName string // これをRoleIDに直接変更することも検討
}

type UserUsecase struct {
	UserRepo repository.UserRepository
	RoleRepo repository.RoleRepository
}

func NewUserUsecase(userRepo repository.UserRepository, roleRepo repository.RoleRepository) *UserUsecase {
	return &UserUsecase{
		UserRepo: userRepo,
		RoleRepo: roleRepo,
	}
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
	defaultRole, err := uc.RoleRepo.GetRoleByID(1) // 例: ID=1をデフォルトロールとする
	if err != nil {
		return nil, fmt.Errorf("デフォルトロールの取得に失敗しました: %w", err)
	}
	if defaultRole == nil {
		return nil, errors.New("デフォルトロール (ID:1) が見つかりません")
	}

	user := &model.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hash),
		RoleID:   defaultRole.ID, // デフォルトロールのIDを割り当てる
	}
	if err := uc.UserRepo.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (uc *UserUsecase) LoginUser(email, password string) (string, *model.User, error) {
	user, err := uc.UserRepo.FindByEmail(strings.ToLower(email))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, errors.New("メールアドレスまたはパスワードが間違っています")
		}
		return "", nil, fmt.Errorf("ユーザー検索に失敗しました: %w", err)
	}
	if user == nil {
		return "", nil, errors.New("メールアドレスまたはパスワードが間違っています")
	}

	fmt.Printf("LoginUser: Found user. RoleID: %d, Role object: %+v\n", user.RoleID, user.Role)
	if user.Role.ID == 0 || user.Role.RoleName == "" {
		fmt.Println("WARNING: user.Role object seems empty or not fully loaded in Usecase!")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return "", nil, errors.New("メールアドレスまたはパスワードが間違っています")
		}
		return "", nil, fmt.Errorf("パスワードの検証に失敗しました: %w", err)
	}

	token, err := config.GenerateToken(user.ID, user.Email, user.Role.RoleName)
	if err != nil {
		return "", nil, fmt.Errorf("認証トークンの生成に失敗しました: %w", err)
	}

	return token, user, nil
}

func (uc *UserUsecase) GetUser() ([]model.User, error) {
	return uc.UserRepo.FindAll()
}

func (uc *UserUsecase) GetUserByID(id uint) (*model.User, error) {
	return uc.UserRepo.FindByID(id)
}
