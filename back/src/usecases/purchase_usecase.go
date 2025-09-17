package usecases

import (
	"errors"
	"fmt"
	"strconv" // strconvをインポート
	"time"

	"modules/src/database/model"
	"modules/src/datastructure/request"
	"modules/src/datastructure/response"
	"modules/src/repository"

	"gorm.io/gorm"
)

type PurchaseUsecase struct {
	PurchaseRepo  repository.PurchaseRepository
	ScreeningRepo repository.ScreeningRepository
	SeatRepo      repository.SeatRepository
	RoleRepo      repository.RoleRepository
}

func NewPurchaseUsecase(
	pr repository.PurchaseRepository,
	sr repository.ScreeningRepository,
	seatr repository.SeatRepository,
	rr repository.RoleRepository,
) *PurchaseUsecase {
	return &PurchaseUsecase{
		PurchaseRepo:  pr,
		ScreeningRepo: sr,
		SeatRepo:      seatr,
		RoleRepo:      rr,
	}
}

// CreatePurchase は購入情報を作成するよ。（既存のまま）
func (uc *PurchaseUsecase) CreatePurchase(purchase *model.Purchase, reqDetails []request.CreatePurchaseDetail) error {
	totalPrice := 0

	var purchaseDetails []model.PurchaseDetail
	for _, reqDetail := range reqDetails {
		role, err := uc.RoleRepo.GetRoleByID(reqDetail.RoleID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("指定されたロールが見つかりません (RoleID: %d)", reqDetail.RoleID)
			}
			return fmt.Errorf("ロール情報の取得に失敗しました (RoleID: %d): %w", reqDetail.RoleID, err)
		}
		if role == nil {
			return fmt.Errorf("指定されたロールが見つかりません (RoleID: %d)", reqDetail.RoleID)
		}

		rolePrice := role.PriceYen
		if rolePrice <= 0 {
			return fmt.Errorf("ロールの単価が有効ではありません (RoleID: %d, PriceYen: %d)", reqDetail.RoleID, rolePrice)
		}

		subtotal := reqDetail.Quantity * rolePrice

		purchaseDetails = append(purchaseDetails, model.PurchaseDetail{
			RoleID:   reqDetail.RoleID,
			Quantity: reqDetail.Quantity,
			PriceYen: rolePrice,
			Subtotal: subtotal,
		})
		totalPrice += subtotal
	}

	purchase.TotalPrice = totalPrice
	purchase.PurchaseDetails = purchaseDetails

	if err := uc.PurchaseRepo.CreatePurchase(purchase); err != nil {
		return fmt.Errorf("購入の作成に失敗しました: %w", err)
	}
	return nil
}

func (uc *PurchaseUsecase) GetAllPurchases() ([]model.Purchase, error) {
	purchases, err := uc.PurchaseRepo.GetAllPurchases() // リポジトリ層を呼び出す
	if err != nil {
		return nil, fmt.Errorf("全ての購入情報の取得に失敗しました: %w", err)
	}
	return purchases, nil
}

func (uc *PurchaseUsecase) GetPurchaseByID(id uint) (*model.Purchase, error) {
	purchase, err := uc.PurchaseRepo.GetPurchaseByID(id)
	if err != nil {
		return nil, fmt.Errorf("購入情報の取得に失敗しました: %w", err)
	}
	return purchase, nil
}

// GetUserReservations は特定のユーザーの全ての予約情報を取得し、フロントエンド向けの形式に整形するよ。
func (uc *PurchaseUsecase) GetUserReservations(userID uint) ([]response.UserReservationResponse, error) {
	purchases, err := uc.PurchaseRepo.GetPurchasesByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("ユーザーの購入情報を取得できませんでした: %w", err)
	}

	var userReservations []response.UserReservationResponse
	now := time.Now()

	for _, p := range purchases {
		screening := p.Screening // Purchase -> Screening

		// Screening -> ScreeningPeriod -> Movie/Screen のパス
		screeningPeriod := screening.ScreeningPeriod // Screening -> ScreeningPeriod
		movie := screeningPeriod.Movie               // ScreeningPeriod -> Movie
		screen := screeningPeriod.Screen             // ScreeningPeriod -> Screen

		// 上映終了時刻の計算：StartTimeにDuration（分）を加える
		endTime := screening.StartTime.Add(time.Duration(screening.Duration) * time.Minute)

		for _, rs := range p.ReservationSeats { // 購入に紐づく各予約座席について処理
			seat := rs.Seat // ReservationSeat -> Seat

			// 上映開始までの時間計算
			diff := screening.StartTime.Sub(now)
			timeUntilStr := ""
			if diff <= 0 {
				timeUntilStr = "上映済み"
			} else {
				totalSeconds := int(diff.Seconds())
				hours := totalSeconds / 3600
				minutes := (totalSeconds % 3600) / 60
				seconds := totalSeconds % 60
				timeUntilStr = fmt.Sprintf("残り %d時間 %d分 %d秒", hours, minutes, seconds)
			}

			userReservations = append(userReservations, response.UserReservationResponse{
				PurchaseID:        p.ID,
				ReservationSeatID: rs.ID,
				MovieTitle:        movie.Title,                               // 映画タイトル
				Date:              screening.StartTime.Format("2006年01月02日"), // 例: "2024年07月06日"
				Time:              screening.StartTime.Format("15:04"),       // 例: "10:00"
				EndTime:           endTime.Format("15:04"),                   // 例: "12:00"
				Screen:            strconv.FormatUint(uint64(screen.ID), 10), // スクリーンIDを文字列に変換
				Seat:              seat.Row + strconv.Itoa(seat.Column),      // 座席番号 (例: "A-5")
				PosterURL:         movie.PosterPath,                          // 映画ポスターのパス
				TimeUntil:         timeUntilStr,                              // 上映までの残り時間
				IsCancelled:       rs.IsCancelled,
				CancelledAt:       rs.CancelledAt,
			})
		}
	}
	return userReservations, nil
}
