package usecases

import (
	"fmt"
	"modules/src/database/model"
	"modules/src/repository" // SeatRepository インターフェースのパス
	"strings"
)

type SeatUsecase struct {
	SeatRepo   repository.SeatRepository
	ScreenRepo repository.ScreenRepository
}

func (uc *SeatUsecase) CreateSeat(seat *model.Seat) error {
	return uc.SeatRepo.Create(seat)
}

func (uc *SeatUsecase) GetAllSeats() ([]model.Seat, error) {
	return uc.SeatRepo.GetAll()
}

func (uc *SeatUsecase) GetSeatsByScreenID(id uint) ([]model.Seat, error) {
	return uc.SeatRepo.FindByScreenID(id)
}

func (uc *SeatUsecase) GetSeatByRowColumnScreenID(row string, column int, screenID uint) (*model.Seat, error) {
	seat, err := uc.SeatRepo.GetSeatByRowColumnScreenID(row, column, screenID)
	if err != nil {
		// リポジトリがエラーを返すので、そのままエラーを伝える
		return nil, fmt.Errorf("座席情報(行: %s, 列: %d, スクリーンID: %d) の取得に失敗しました: %w", row, column, screenID, err)
	}
	return seat, nil // 取得した座席を返す
}

// スクリーンの最大行・列までまとめて座席を生成する
func (uc *SeatUsecase) GenerateSeatsByScreenID(screenID uint) (int, error) {
	screen, err := uc.ScreenRepo.FindByID(screenID)
	if err != nil {
		return 0, fmt.Errorf("スクリーン情報の取得に失敗しました: %w", err)
	}

	maxRow := strings.TrimSpace(screen.MaxRow)
	if maxRow == "" {
		return 0, fmt.Errorf("スクリーンに最大行が設定されていません")
	}
	// rune は1文字（Unicodeコードポイント）を表す整数型
	rowRune := []rune(strings.ToUpper(maxRow))[0]
	if rowRune < 'A' || rowRune > 'Z' {
		return 0, fmt.Errorf("最大行の指定が不正です: %s", maxRow)
	}

	created := 0
	for r := 'A'; r <= rowRune; r++ {
		for c := 1; c <= screen.MaxColumn; c++ {
			existing, err := uc.SeatRepo.GetSeatByRowColumnScreenID(string(r), c, screenID)
			if err != nil {
				return created, fmt.Errorf("既存座席確認に失敗しました: %w", err)
			}
			if existing != nil {
				continue
			}
			if err := uc.SeatRepo.Create(&model.Seat{ScreenID: screenID, Row: string(r), Column: c}); err != nil {
				return created, fmt.Errorf("座席作成に失敗しました: %w", err)
			}
			created++
		}
	}

	return created, nil
}
