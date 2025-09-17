package usecases

import (
	"errors"
	"fmt"
	"modules/src/config"
	"strconv"
	"strings"
	"time"

	"modules/src/database/model"
	"modules/src/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrUserNotFound    = errors.New("ユーザーが見つかりません")
	ErrEmailExists     = errors.New("そのメールアドレスは既に使用されています")
	ErrInvalidPassword = errors.New("パスワードが正しくありません")
	// 必要に応じて他のカスタムエラーもここに追加
)

type RegisterUserInput struct {
	Name           string
	Email          string
	Password       string
	RoleName       string // これをRoleIDに直接変更することも検討
	PhoneNumber    string
	CardNumber     string
	CardExpiration *time.Time
}

type UpdateUserInput struct {
	ID             uint // どのユーザーを更新するか
	Name           *string
	Email          *string
	Password       *string
	RoleName       *string
	PhoneNumber    *string
	CardNumber     *string
	CardExpiration *string
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

func parseExpirationDate(s string) (time.Time, error) {
	// "/"で月と年を分割
	parts := strings.Split(s, "/")
	if len(parts) != 2 {
		return time.Time{}, errors.New("有効期限のフォーマットが不正です。MM/YY形式で入力してください")
	}

	// 月を数値に変換
	month, err := strconv.Atoi(parts[0])
	if err != nil || month < 1 || month > 12 {
		return time.Time{}, errors.New("有効期限の「月」が不正です")
	}

	// 年を数値に変換
	year, err := strconv.Atoi(parts[1])
	if err != nil {
		return time.Time{}, errors.New("有効期限の「年」が不正です")
	}

	if year < 100 {
		year += 2000
	}

	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		loc = time.UTC
	}

	firstDayOfMonth := time.Date(year, time.Month(month), 1, 23, 59, 59, 0, loc)
	lastDayOfMonth := firstDayOfMonth.AddDate(0, 1, -1)

	return lastDayOfMonth, nil
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

func (uc *UserUsecase) UpdateUser(input UpdateUserInput) error {
	user, err := uc.UserRepo.FindByID(input.ID)
	if err != nil {

		return ErrUserNotFound
	}

	if input.Name != nil {
		user.Name = *input.Name
	}

	if input.PhoneNumber != nil {
		user.PhoneNumber = *input.PhoneNumber
	}

	if input.Email != nil && user.Email != *input.Email {
		existingUser, _ := uc.UserRepo.FindByEmail(*input.Email)
		if existingUser != nil {
			return ErrEmailExists
		}
		user.Email = *input.Email
	}

	if input.Password != nil && *input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*input.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashedPassword)
	}

	if input.CardNumber != nil {
		user.CardNumber = *input.CardNumber
	}

	if input.CardExpiration != nil {

		t, err := parseExpirationDate(*input.CardExpiration)
		if err != nil {
			return err
		}
		user.CardExpiration = &t
	}

	if err := uc.UserRepo.Update(user); err != nil {
		return err
	}

	return nil // 成功
}
